import sslValidator from 'ssl-validator';
import GQLError from '../errors/GQLError';
import userMessages from '../errors/UserMessages';
import TYPES from '../container/IOC.types';
import container from '../container/IOC.config';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';

export const uploadCertificate = async (
    domain: string,
    cert: string,
    key: string,
): Promise<void> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    const storage = container.get<BaseStorage>(TYPES.BackendStorage);

    if (
        await sslValidator.isValidSSL(cert, {
            key: key,
            domain: domain,
        })
    ) {
        const upload = async (uri: string, data: string) =>
            storage.put(await config.getGCConfigsBucket(), uri, data, {
                contentType: 'text/plain',
            });

        await upload(`ssl/${domain}.crt`, cert);
        await upload(`ssl/${domain}.key`, key);
    } else {
        throw new GQLError(userMessages.invalidCertificate, true);
    }
};
