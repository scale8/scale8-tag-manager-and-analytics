import sslValidator from 'ssl-validator';
import GQLError from '../errors/GQLError';
import userMessages from '../errors/UserMessages';
import TYPES from '../container/IOC.types';
import container from '../container/IOC.config';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import User from '../mongo/models/User';
import Environment from '../mongo/models/tag/Environment';
import IngestEndpointEnvironment from '../mongo/models/data/IngestEndpointEnvironment';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import OperationOwner from '../enums/OperationOwner';
import GQLMethod from '../enums/GQLMethod';
import dns from 'dns';
import Route53Service from '../aws/Route53Service';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';

export const getCNAME = (environment: Environment | IngestEndpointEnvironment): string => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    return `${config.getEnvironmentIdPrefix()}${environment.id.toString()}.scale8.com`;
};

const getCnameValueForDomain = async (domain: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        dns.resolve(domain, 'CNAME', (err, addresses) => {
            if (err) {
                reject(`Failed to find CNAME record for ${domain}`);
            } else {
                resolve(addresses[0]);
            }
        });
    });
};

const uploadCertificate = async (domain: string, cert: string, key: string): Promise<void> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    const storage = container.get<BaseStorage>(TYPES.BackendStorage);
    if (
        await sslValidator.isValidSSL(cert, {
            key: key,
            domain: domain,
        })
    ) {
        const upload = async (uri: string, data: string) =>
            storage.setAsString(await config.getConfigsBucket(), uri, data, {
                contentType: 'text/plain',
            });

        await upload(`ssl/${domain}.crt`, cert);
        await upload(`ssl/${domain}.key`, key);
    } else {
        throw new GQLError(userMessages.invalidCertificate, true);
    }
};

export const createCname = async (environment: Environment | IngestEndpointEnvironment) => {
    const route53Service = container.get<Route53Service>(TYPES.Route53Service);
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    const logger = container.get<BaseLogger>(TYPES.BackendLogger);

    //todo. we'll eliminate the need for this in non-prod envs with a redirect service at a later point.
    if (config.isCommercial() && !config.isProduction()) {
        //create a domain alias...
        const awsId = await config.getAwsId();

        const route53 =
            awsId === null
                ? route53Service.getRoute53Client()
                : route53Service.getRoute53Client(awsId, await config.getAwsSecret());
        try {
            await route53Service.createNewCNAME(
                route53,
                `${config.getEnvironmentIdPrefix()}${environment.id.toString()}.scale8.com`,
                await config.getCdnDomain(),
            );
        } catch (e) {
            await logger.warn(
                'Failed to create CNAME for new environment, it might already exist',
                { error: e },
            );
        }
    }
};

export const updateCustomDomainForEnvironment = async (
    actor: User,
    environment: Environment | IngestEndpointEnvironment,
    customDomain: string,
    customDomainCert: string,
    customDomainKey: string,
) => {
    const cnameValue = await getCnameValueForDomain(customDomain);
    if (cnameValue === getCNAME(environment)) {
        await uploadCertificate(customDomain, customDomainCert, customDomainKey);
        environment.customDomain = customDomain;
        const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
        await repoFactory(environment.constructor.name).save(
            environment,
            actor,
            OperationOwner.USER,
            {
                gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                userComments: 'Updated SSL certificate',
            },
        );
    } else {
        throw new GQLError(userMessages.noCname, true);
    }
};
