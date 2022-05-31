import container from '../container/IOC.config';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import App from '../mongo/models/tag/App';
import { getAppUsageSchema } from '../utils/AppUtils';
import Hash from '../core/Hash';
import { updateUsageEndpointEnvironment } from '../utils/IngestEndpointEnvironmentUtils';
import IngestEndpointEnvironment from '../mongo/models/data/IngestEndpointEnvironment';

const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
const logger = container.get<BaseLogger>(TYPES.BackendLogger);

export const trackingSchemaUpdate = {
    name: 'TrackingSchemaUpdate',
    job: async () => {
        const apps = repoFactory(App).findIterator({});

        const appTrackingSchema = getAppUsageSchema();
        const appTrackingSchemaHash = Hash.hashString(JSON.stringify(appTrackingSchema));

        logger.info(`Current app usage schema hash: ${appTrackingSchemaHash}`).then();

        for await (const app of apps) {
            if (app.usageIngestEndpointEnvironmentId !== undefined) {
                const ingestEndpointEnvironment = await repoFactory(
                    IngestEndpointEnvironment,
                ).findByIdThrows(app.usageIngestEndpointEnvironmentId);
                if (app.usageSchemaHash != appTrackingSchemaHash) {
                    logger.info(`App is not running the latest schema, updating it...`).then();
                    await updateUsageEndpointEnvironment(
                        'SYSTEM',
                        ingestEndpointEnvironment,
                        appTrackingSchema,
                    );
                }
            }
        }
    },
};
