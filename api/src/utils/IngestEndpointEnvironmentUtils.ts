import IngestEndpointEnvironment from '../mongo/models/data/IngestEndpointEnvironment';
import { MongoClient, ObjectId } from 'mongodb';
import User from '../mongo/models/User';
import IngestEndpoint from '../mongo/models/data/IngestEndpoint';
import IngestEndpointRevision from '../mongo/models/data/IngestEndpointRevision';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import { createCname, getCNAME, updateCustomDomainForEnvironment } from './CertificateUtils';
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
import { IngestEndpointDataMapSchema, OperationActor, StorageProviderConfig } from '../mongo/types/Types';
import DataManagerAccountRepo from '../mongo/repos/data/DataManagerAccountRepo';
import { StorageProvider } from '../enums/StorageProvider';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import { BigQuery } from '@google-cloud/bigquery';
import Hash from '../core/Hash';
import S3Service from '../aws/S3Service';
import { AwsKinesisConfig, AwsS3Config, GCBigQueryStreamConfig, MongoDbPushConfig } from '../Types';
import KinesisService from '../aws/KinesisService';
import { generateRevisionName } from '../../../common/utils/GenerateRevisionName';

export const getCommercialStorageProviderConfig = async (): Promise<StorageProviderConfig> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    return {
        config: {
            service_account_json: {},
            data_set_name: await config.getAnalyticsDataSetName(),
            require_partition_filter_in_queries: true,
        },
        hint: `S8 Managed Ingest Endpoint`,
    };
};

export const getCommercialStorageProvider = (): StorageProvider => {
    return StorageProvider.GC_BIGQUERY_STREAM;
};

const getStorageBackend = (): BaseStorage => container.get<BaseStorage>(TYPES.BackendStorage);

export const getIngestEndpointInstallDomain = (
    ingestEndpointEnvironment: IngestEndpointEnvironment,
): string => {
    if (ingestEndpointEnvironment.customDomain === undefined) {
        return getCNAME(ingestEndpointEnvironment);
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
    ingestEndpointEnvironmentId: ObjectId,
): Promise<
    | GCBigQueryStreamConfig
    | AwsS3Config
    | AwsKinesisConfig
    | MongoDbPushConfig
    | Record<string, never>
> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    try {
        const obj = await getStorageBackend().getAsString(
            await config.getConfigsBucket(),
            `ingest-endpoint/storage-provider-config-${ingestEndpointEnvironmentId}.json`,
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

    const storageProviderConfig = await getStorageProviderConfig(ingestEndpointEnvironment.id);

    const config: { [k: string]: any } = {
        built: new Date().toUTCString(),
        is_managed: dataManagerAccount.accountType === AccountType.SYSTEM,
        usage_ingest_env_id: (await getIngestUsageIngestEnvironmentId(ingestEndpoint)) || '',
        org_id: ingestEndpointRevision.orgId.toString(),
        data_manager_account_id: ingestEndpointRevision.dataManagerAccountId.toString(),
        is_analytics_enabled: ingestEndpoint.analyticsEnabled,
        is_commercial: backendConfig.isCommercial(),
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

    await uploadTo(`${getCNAME(ingestEndpointEnvironment)}.json`);

    if (ingestEndpointEnvironment.customDomain !== undefined) {
        await uploadTo(`${ingestEndpointEnvironment.customDomain}.json`);
    }

    return config;
};

export const updateIngestEndpointEnvironment = async (
    actor: OperationActor,
    ingestEndpointEnvironment: IngestEndpointEnvironment,
    providerConfig?: StorageProviderConfig,
    newName?: string,
    ingestEndpointRevisionId?: string | ObjectId,
    customDomain?: string,
    customDomainCert?: string,
    customDomainKey?: string,
): Promise<IngestEndpointEnvironment> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    if (
        config.isCommercial() &&
        customDomain !== undefined &&
        customDomainCert !== undefined &&
        customDomainKey !== undefined
    ) {
        await updateCustomDomainForEnvironment(
            actor,
            ingestEndpointEnvironment,
            customDomain,
            customDomainCert,
            customDomainKey,
        );
    }

    if (newName !== undefined) {
        ingestEndpointEnvironment.name = newName;
    }

    //we are trying to attach a new revision to this environment
    const findRevision = async () => {
        if (ingestEndpointRevisionId !== undefined) {
            return await repoFactory(IngestEndpointRevision).findOneThrows(
                {
                    _id: new ObjectId(ingestEndpointRevisionId),
                    _ingest_endpoint_id: ingestEndpointEnvironment.ingestEndpointId,
                },
                userMessages.revisionFailed,
            );
        }
        return null;
    };

    const revision = await findRevision();

    //we need to check this revision is ok to attach...
    if (revision !== null) {
        if (revision.isFinal) {
            ingestEndpointEnvironment.ingestEndpointRevisionId = revision.id;
        } else {
            throw new GQLError(userMessages.revisionNotFinalAttaching, true);
        }
    }

    if (providerConfig !== undefined) {
        ingestEndpointEnvironment.configHint = providerConfig.hint;
        await getStorageBackend().setAsString(
            await config.getConfigsBucket(),
            `ingest-endpoint/storage-provider-config-${ingestEndpointEnvironment.id}.json`,
            JSON.stringify(providerConfig.config),
            { contentType: 'application/json' },
        );
    }

    await repoFactory(IngestEndpointEnvironment).save(ingestEndpointEnvironment, actor);
    //now build the config...
    await buildIngestEndpointConfig(ingestEndpointEnvironment);

    return ingestEndpointEnvironment;
};

export const createIngestEndpointEnvironment = async (
    actor: User,
    ingestEndpoint: IngestEndpoint,
    name: string,
    provider: StorageProvider,
    providerConfig: StorageProviderConfig,
    ingestEndpointRevision: IngestEndpointRevision,
    fixedId?: ObjectId,
): Promise<IngestEndpointEnvironment> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    let ingestEndpointEnvironment = new IngestEndpointEnvironment(
        name,
        ingestEndpoint,
        provider,
        providerConfig.hint,
        ingestEndpointRevision,
    );
    if (fixedId !== undefined) {
        ingestEndpointEnvironment['_id'] = fixedId;
    }

    ingestEndpointEnvironment = await repoFactory(IngestEndpointEnvironment).save(
        ingestEndpointEnvironment,
        actor,
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

const getAwsKinesisProviderConfig = async (awsKinesisConfig: AwsKinesisConfig) => {
    const kinesisService = container.get<KinesisService>(TYPES.KinesisService);
    //we need to test AWS setup is correct...
    const kinesis = kinesisService.getKinesisClient(
        awsKinesisConfig.access_key_id,
        awsKinesisConfig.secret_access_key,
        awsKinesisConfig.region,
    );
    if (!(await kinesisService.isStreamWriteable(kinesis, awsKinesisConfig.stream_name))) {
        throw new GQLError(userMessages.awsKinesisCantWrite(awsKinesisConfig.stream_name), true);
    }
    return {
        config: awsKinesisConfig,
        hint: `Using AWS Access Key: ${awsKinesisConfig.access_key_id}`,
    };
};

const getAwsS3ProviderConfig = async (awsStorageConfig: AwsS3Config) => {
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

const getBigQueryProviderConfig = async (bigqueryStreamConfig: GCBigQueryStreamConfig) => {
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

const getMongoDbProviderConfig = async (mongoPushConfig: MongoDbPushConfig) => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    const connectionString = mongoPushConfig.use_api_mongo_server
        ? await config.getDatabaseUrl()
        : mongoPushConfig.connection_string;

    const databaseName = mongoPushConfig.use_api_mongo_server
        ? await config.getDefaultDatabase()
        : mongoPushConfig.database_name;

    const getMongoConnection = async () => {
        try {
            const client = new MongoClient(connectionString);
            return await client.connect();
        } catch (e) {
            throw new GQLError(
                userMessages.mongoConnectionStringVerificationFailure(connectionString),
                true,
            );
        }
    };

    const connection = await getMongoConnection();

    try {
        const database = connection.db(databaseName);

        await database
            .collection(`s8_${Hash.shortRandomHash()}_verification`)
            .insertOne({ s8: true });
    } catch (e) {
        throw new GQLError(userMessages.mongoDatabaseVerificationFailure(databaseName), true);
    } finally {
        connection.close(true).then();
    }
    return {
        config: mongoPushConfig,
        hint: mongoPushConfig.use_api_mongo_server
            ? 'Sharing API MongoDB database'
            : `Using MongoDB database: ${mongoPushConfig.database_name}`,
    };
};

export const getProviderConfig = async (
    data: any,
    ingestEndpointEnvironment?: IngestEndpointEnvironment,
): Promise<StorageProviderConfig | undefined> => {
    const storageBackend = data.storage_backend;

    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    const storageProviderType =
        ingestEndpointEnvironment !== undefined
            ? ingestEndpointEnvironment.storageProvider
            : data.storage_provider;

    if (
        storageProviderType === StorageProvider.AWS_S3 &&
        storageBackend.aws_storage_config !== undefined
    ) {
        return await getAwsS3ProviderConfig(storageBackend.aws_storage_config);
    } else if (
        storageProviderType === StorageProvider.AWS_KINESIS &&
        storageBackend.aws_kinesis_config !== undefined
    ) {
        return await getAwsKinesisProviderConfig(storageBackend.aws_kinesis_config);
    } else if (
        storageProviderType === StorageProvider.GC_BIGQUERY_STREAM &&
        storageBackend.gc_bigquery_stream_config !== undefined
    ) {
        return await getBigQueryProviderConfig(storageBackend.gc_bigquery_stream_config);
    } else if (
        storageProviderType === StorageProvider.MONGODB &&
        storageBackend.mongo_push_config !== undefined &&
        config.isNotCommercial()
    ) {
        return await getMongoDbProviderConfig(storageBackend.mongo_push_config);
    } else {
        return undefined;
    }
};

export const getProviderConfigThrows = async (data: any): Promise<StorageProviderConfig> => {
    const value = await getProviderConfig(data);
    if (value === undefined) {
        throw new GQLError(userMessages.noStorageProvider, true);
    } else {
        return value;
    }
};

export const createUsageEndpointEnvironment = async (
    org: Org,
    trackingEntity: App | IngestEndpoint,
    actor: User,
    provider: StorageProvider,
    providerConfig: StorageProviderConfig,
    schema: IngestEndpointDataMapSchema[],
): Promise<IngestEndpointEnvironment> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const dataManagerAccount = await repoFactory<DataManagerAccountRepo>(
        DataManagerAccount,
    ).getSystemAccountFromOrg(org);

    //create ingest endpoint...
    const ingestEndpoint = await repoFactory(IngestEndpoint).save(
        new IngestEndpoint(
            `S8 - Track Usage (${trackingEntity.id.toString()})`,
            dataManagerAccount,
            false,
            provider,
        ),
        actor,
    );
    //create revision...
    let ingestEndpointRevision = await repoFactory(IngestEndpointRevision).save(
        new IngestEndpointRevision(generateRevisionName(), ingestEndpoint),
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
        provider,
        providerConfig,
        ingestEndpointRevision,
    );
    //create the new env...
    await buildIngestEndpointConfig(ingestEndpointEnvironment);
    return ingestEndpointEnvironment;
};

export const updateUsageEndpointEnvironment = async (
    actor: OperationActor,
    ingestEndpointEnvironment: IngestEndpointEnvironment,
    schema: IngestEndpointDataMapSchema[],
): Promise<void> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const ingestEndpoint = await repoFactory(IngestEndpoint).findByIdThrows(
        ingestEndpointEnvironment.ingestEndpointId,
    );
    //create revision...
    let ingestEndpointRevision = await repoFactory(IngestEndpointRevision).save(
        new IngestEndpointRevision(generateRevisionName(), ingestEndpoint),
        actor,
    );
    //create new datamaps for schema
    ingestEndpointRevision.ingestEndpointDataMapIds = (
        await createIngestEndpointDataMapFromSchemas(actor, schema, ingestEndpointRevision)
    ).map((_) => _.id);
    ingestEndpointRevision.isFinal = true; //no further changes to this...
    ingestEndpointRevision = await repoFactory(IngestEndpointRevision).save(
        ingestEndpointRevision,
        actor,
    );
    //this will update with new revision and deploy...
    await updateIngestEndpointEnvironment(
        actor,
        ingestEndpointEnvironment,
        undefined,
        undefined,
        ingestEndpointRevision.id,
    );
};
