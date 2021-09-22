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

export const getServiceAccountJson = async (
    entityUsageIngestEndpointEnvironmentId: ObjectID,
): Promise<JWTInput> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    if (config.isCommercial()) {
        return await getServiceAccountJsonFromConfig();
    }

    const storageProviderConfig = (await getStorageProviderConfig(
        entityUsageIngestEndpointEnvironmentId,
    )) as GCBigQueryStreamConfig;

    return storageProviderConfig.service_account_json;
};
