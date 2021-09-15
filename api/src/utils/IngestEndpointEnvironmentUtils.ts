import IngestEndpointEnvironment from '../mongo/models/data/IngestEndpointEnvironment';
import { MongoClient, ObjectID } from 'mongodb';
import User from '../mongo/models/User';
import IngestEndpoint from '../mongo/models/data/IngestEndpoint';
import IngestEndpointRevision from '../mongo/models/data/IngestEndpointRevision';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import { uploadCertificate } from './CertificateUtils';
import GQLError from '../errors/GQLError';
import userMessages from '../errors/UserMessages';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import { AccountType } from '../enums/AccountType';
import IngestEndpointDataMap from '../mongo/models/data/IngestEndpointDataMap';
import {
    createIngestEndpointDataMapFromSchemas,
    createIngestEndpointDataMapValidationSchema,
} from './IngestEndpointDataMapUtils';
import Org from '../mongo/models/Org';
import App from '../mongo/models/tag/App';
import { IngestEndpointDataMapSchema, StorageProviderConfig } from '../mongo/types/Types';
import DataManagerAccountRepo from '../mongo/repos/data/DataManagerAccountRepo';
import { StorageProvider } from '../enums/StorageProvider';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import BaseDatabase from '../backends/databases/abstractions/BaseDatabase';
import { createCname } from './EnvironmentUtils';
import { BigQuery } from '@google-cloud/bigquery';
import Hash from '../core/Hash';
import S3Service from '../aws/S3Service';

export const getIngestEndpointCNAME = (ingestEndpointEnvironmentId: ObjectID | string): string => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    return `${config.getEnvironmentIdPrefix()}${ingestEndpointEnvironmentId.toString()}.scale8.com`;
};

const getStorageBackend = (): BaseStorage => container.get<BaseStorage>(TYPES.BackendStorage);

export const getIngestEndpointInstallDomain = (
    ingestEndpointEnvironment: IngestEndpointEnvironment,
): string => {
    if (ingestEndpointEnvironment.customDomain === undefined) {
        return getIngestEndpointCNAME(ingestEndpointEnvironment.id);
    } else {
        return ingestEndpointEnvironment.customDomain;
    }
};

const getIngestUsageIngestEnvironmentId = async (
    ingestEndpoint: IngestEndpoint,
): Promise<string | undefined> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    return ingestEndpoint.usageIngestEndpointEnvironmentId === undefined
        ? undefined
        : (
              await repoFactory(IngestEndpointEnvironment).findByIdThrows(
                  ingestEndpoint.usageIngestEndpointEnvironmentId,
                  userMessages.usageFailed,
              )
          ).id.toString();
};

export const getStorageProviderConfig = async (
    ingestEndpointEnvironment: IngestEndpointEnvironment,
): Promise<Record<string, unknown>> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    try {
        const obj = await getStorageBackend().getAsString(
            await config.getConfigsBucket(),
            `ingest-endpoint/storage-provider-config-${ingestEndpointEnvironment.id}.json`,
        );
        return JSON.parse((obj as any).toString('utf-8'));
    } catch (e) {
        return {}; //no file exists, in theory this should not happen. handle via track server / notifications
    }
};

export const buildIngestEndpointConfig = async (
    ingestEndpointEnvironment: IngestEndpointEnvironment,
): Promise<{ [k: string]: any }> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const backendConfig = container.get<BaseConfig>(TYPES.BackendConfig);

    const ingestEndpoint = await repoFactory(IngestEndpoint).findByIdThrows(
        ingestEndpointEnvironment.ingestEndpointId,
        userMessages.ingestEndpointFailed,
    );
    const dataManagerAccount = await repoFactory(DataManagerAccount).findByIdThrows(
        ingestEndpointEnvironment.dataManagerAccountId,
        userMessages.accountFailed,
    );
    const ingestEndpointRevision = await repoFactory(IngestEndpointRevision).findByIdThrows(
        ingestEndpointEnvironment.ingestEndpointRevisionId,
        userMessages.revisionFailed,
    );

    const storageProviderConfig = await getStorageProviderConfig(ingestEndpointEnvironment);

    const config: { [k: string]: any } = {
        built: new Date().toUTCString(),
        is_managed: dataManagerAccount.accountType === AccountType.SYSTEM,
        usage_ingest_env_id: (await getIngestUsageIngestEnvironmentId(ingestEndpoint)) || '',
        org_id: ingestEndpointRevision.orgId.toString(),
        data_manager_account_id: ingestEndpointRevision.dataManagerAccountId.toString(),
        ingest_endpoint_id: ingestEndpointRevision.ingestEndpointId.toString(),
        ingest_endpoint_environment_id: ingestEndpointEnvironment.id.toString(),
        ingest_endpoint_revision_id: ingestEndpointRevision.id.toString(),
        storage_provider: ingestEndpointEnvironment.storageProvider,
        storage_provider_config: storageProviderConfig,
        schema: await createIngestEndpointDataMapValidationSchema(
            await repoFactory(IngestEndpointDataMap).findByIds(
                ingestEndpointRevision.ingestEndpointDataMapIds,
            ),
        ),
    };

    config[`${ingestEndpointEnvironment.storageProvider.toLowerCase()}_config`] =
        storageProviderConfig;

    const uploadTo = async (fileName: string) =>
        getStorageBackend().setAsString(
            await backendConfig.getConfigsBucket(),
            `ingest-domain/${fileName}`,
            JSON.stringify(config),
            { contentType: 'application/json' },
        );

    await uploadTo(`${getIngestEndpointCNAME(ingestEndpointEnvironment.id)}.json`);

    if (ingestEndpointEnvironment.customDomain !== undefined) {
        await uploadTo(`${ingestEndpointEnvironment.customDomain}.json`);
    }

    return config;
};

export const createIngestEndpointEnvironment = async (
    actor: User,
    ingestEndpoint: IngestEndpoint,
    name: string,
    provider: StorageProvider,
    providerConfig: StorageProviderConfig,
    ingestEndpointRevision: IngestEndpointRevision,
    fixedId?: ObjectID,
    customDomain?: string,
    customDomainCert?: string,
    customDomainKey?: string,
): Promise<IngestEndpointEnvironment> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    const getCustomDomain: () => Promise<string | undefined> = async () => {
        if (customDomain === undefined) {
            return undefined;
        } else {
            if (
                (await repoFactory(IngestEndpointEnvironment).findOne({
                    _custom_domain: customDomain,
                })) === null
            ) {
                //we can safely proceed
                if (customDomainCert !== undefined && customDomainKey !== undefined) {
                    await uploadCertificate(customDomain, customDomainCert, customDomainKey);
                    return customDomain;
                } else {
                    throw new GQLError(userMessages.noCertificate, true);
                }
            } else {
                throw new GQLError(
                    'Unable to create as it would override another configuration potentially',
                    userMessages.unexpectedIssue,
                );
            }
        }
    };

    let ingestEndpointEnvironment = new IngestEndpointEnvironment(
        name,
        ingestEndpoint,
        provider,
        providerConfig.hint,
        ingestEndpointRevision,
        await getCustomDomain(),
    );
    if (fixedId !== undefined) {
        ingestEndpointEnvironment['_id'] = fixedId;
    }

    ingestEndpointEnvironment = await repoFactory(IngestEndpointEnvironment).save(
        ingestEndpointEnvironment,
        actor,
        undefined,
        { forceCreate: fixedId !== undefined },
    );

    await getStorageBackend().setAsString(
        await config.getConfigsBucket(),
        `ingest-endpoint/storage-provider-config-${ingestEndpointEnvironment.id}.json`,
        JSON.stringify(providerConfig.config),
        { contentType: 'application/json' },
    );
    await createCname(ingestEndpointEnvironment);
    await buildIngestEndpointConfig(ingestEndpointEnvironment);
    return ingestEndpointEnvironment;
};

const getAwsS3ProviderConfig = async (awsStorageConfig: any) => {
    const s3Service = container.get<S3Service>(TYPES.S3Service);
    //we need to test AWS setup is correct...
    const s3 = s3Service.getS3Client(
        awsStorageConfig.access_key_id,
        awsStorageConfig.secret_access_key,
        awsStorageConfig.region,
    );
    if (!(await s3Service.bucketExists(s3, awsStorageConfig.bucket_name))) {
        throw new GQLError(userMessages.awsNoBucket(awsStorageConfig.bucket_name), true);
    }
    if (!(await s3Service.isWriteable(s3, awsStorageConfig.bucket_name))) {
        throw new GQLError(userMessages.awsBucketCantWrite(awsStorageConfig.bucket_name), true);
    }
    return {
        config: awsStorageConfig,
        hint: `Using AWS Access Key: ${awsStorageConfig.access_key_id}`,
    };
};

const getBigQueryProviderConfig = async (bigqueryStreamConfig: any) => {
    if (typeof bigqueryStreamConfig.service_account_json !== 'object') {
        throw new GQLError(userMessages.invalidServiceAccount, true);
    }

    const bq = new BigQuery({
        projectId: bigqueryStreamConfig.service_account_json.project_id,
        credentials: {
            client_email: bigqueryStreamConfig.service_account_json.client_email,
            private_key: bigqueryStreamConfig.service_account_json.private_key,
        },
    });

    const dataset = bigqueryStreamConfig.data_set_name;
    const datasetLocation = bigqueryStreamConfig.data_set_location;

    try {
        //check dataset exists. if not attempt to create it...
        const [exists] = await bq.dataset(dataset).exists();
        if (!exists) {
            try {
                await bq.createDataset(dataset, {
                    location: datasetLocation,
                });
            } catch (e) {
                // is rethrown if of type GQLError
                // noinspection ExceptionCaughtLocallyJS
                throw new GQLError(userMessages.datasetFailure(dataset), true);
            }
        }
    } catch (e) {
        if (e instanceof GQLError) {
            throw e;
        } else {
            throw new GQLError(userMessages.datasetVerificationFailure(dataset), true);
        }
    }

    return {
        config: bigqueryStreamConfig,
        hint: `Using GC Service Account: ${bigqueryStreamConfig.service_account_json.client_email}`,
    };
};

const getMongoDbProviderConfig = async (mongoPushConfig: any) => {
    const getMongoConnection = async () => {
        try {
            const client = new MongoClient(mongoPushConfig.connection_string, {
                useNewUrlParser: true,
            });
            return await client.connect();
        } catch (e) {
            throw new GQLError(
                userMessages.mongoConnectionStringVerificationFailure(
                    mongoPushConfig.connection_string,
                ),
                true,
            );
        }
    };

    const connection = await getMongoConnection();

    try {
        const database = connection.db(mongoPushConfig.database_name);

        await database
            .collection(`s8_${Hash.shortRandomHash()}_verification`)
            .insertOne({ s8: true });
    } catch (e) {
        throw new GQLError(
            userMessages.mongoDatabaseVerificationFailure(mongoPushConfig.database_name),
            true,
        );
    } finally {
        connection.close(true).then();
    }
    return {
        config: mongoPushConfig,
        hint: `Using MongoDB database: ${mongoPushConfig.database_name}`,
    };
};

export const getProviderConfig = async (data: any): Promise<StorageProviderConfig> => {
    if (data.storage_provider === StorageProvider.AWS_S3 && data.aws_storage_config !== undefined) {
        return await getAwsS3ProviderConfig(data.aws_storage_config);
    } else if (
        data.storage_provider === StorageProvider.GC_BIGQUERY_STREAM &&
        data.gc_bigquery_stream_config !== undefined
    ) {
        return await getBigQueryProviderConfig(data.gc_bigquery_stream_config);
    } else if (
        data.storage_provider === StorageProvider.MONGODB &&
        data.mongo_push_config !== undefined
    ) {
        return await getMongoDbProviderConfig(data.mongo_push_config);
    } else {
        throw new GQLError(userMessages.noStorageProvider, true);
    }
};

export const createUsageEndpointEnvironment = async (
    org: Org,
    trackingEntity: App | IngestEndpoint,
    actor: User,
    schema: IngestEndpointDataMapSchema[],
): Promise<IngestEndpointEnvironment> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const baseDatabase = container.get<BaseDatabase>(TYPES.BackendDatabase);

    const dataManagerAccount = await repoFactory<DataManagerAccountRepo>(
        DataManagerAccount,
    ).getSystemAccountFromOrg(org);

    //create ingest endpoint...
    const ingestEndpoint = await repoFactory(IngestEndpoint).save(
        new IngestEndpoint(
            `S8 - Track Usage (${trackingEntity.id.toString()})`,
            dataManagerAccount,
        ),
        actor,
    );
    //create revision...
    let ingestEndpointRevision = await repoFactory(IngestEndpointRevision).save(
        new IngestEndpointRevision('Revision 1', ingestEndpoint),
        actor,
    );
    ingestEndpointRevision.ingestEndpointDataMapIds = (
        await createIngestEndpointDataMapFromSchemas(actor, schema, ingestEndpointRevision)
    ).map((_) => _.id);
    ingestEndpointRevision.isFinal = true; //no further changes to this...
    ingestEndpointRevision = await repoFactory(IngestEndpointRevision).save(
        ingestEndpointRevision,
        actor,
    );
    const ingestEndpointEnvironment = await createIngestEndpointEnvironment(
        actor,
        ingestEndpoint,
        'production',
        baseDatabase.getStorageProvider(),
        await baseDatabase.getStorageProviderConfig(),
        ingestEndpointRevision,
    );
    //create the new env...
    await buildIngestEndpointConfig(ingestEndpointEnvironment);
    return ingestEndpointEnvironment;
};
