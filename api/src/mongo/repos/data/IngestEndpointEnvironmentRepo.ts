import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import { IndexDescription } from 'mongodb';
import IngestEndpointEnvironment from '../../models/data/IngestEndpointEnvironment';

@injectable()
export default class IngestEndpointEnvironmentRepo extends Repo<IngestEndpointEnvironment> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            background: false,
            key: {
                _ingest_endpoint_id: 1,
            },
        },
        {
            background: false,
            key: {
                _system_name: 1,
            },
            unique: true,
            sparse: true,
        },
    ];
}
