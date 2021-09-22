import { ObjectID } from 'mongodb';
import { JWTInput } from 'google-auth-library/build/src/auth/credentials';
import fs from 'fs';
import path from 'path';
import { getStorageProviderConfig } from './IngestEndpointEnvironmentUtils';
import { GCBigQueryStreamConfig } from '../Types';
import container from '../container/IOC.config';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import TYPES from '../container/IOC.types';

export const getServiceAccountJsonFromConfig = async (): Promise<JWTInput> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    return JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), await config.getGCKeyFile()), 'utf8'),
    ) as JWTInput;
};

export const getBigQueryConfig = async (
    entityUsageIngestEndpointEnvironmentId: ObjectID,
): Promise<GCBigQueryStreamConfig> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    if (config.isCommercial()) {
        return {
            service_account_json: await getServiceAccountJsonFromConfig(),
            data_set_name: await config.getAnalyticsDataSetName(),
            data_set_location: 'EU',
            require_partition_filter_in_queries: true,
        };
    }

    return (await getStorageProviderConfig(
        entityUsageIngestEndpointEnvironmentId,
    )) as GCBigQueryStreamConfig;
};

export const getServiceAccountJson = async (
    entityUsageIngestEndpointEnvironmentId: ObjectID,
): Promise<JWTInput> => {
    return (await getBigQueryConfig(entityUsageIngestEndpointEnvironmentId)).service_account_json;
};
