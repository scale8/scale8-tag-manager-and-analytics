import { inject, injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { MongoClient, ObjectID } from 'mongodb';
import TYPES from '../../container/IOC.types';
import GQLError from '../../errors/GQLError';
import S3Service from '../../aws/S3Service';
import IngestEndpointEnvironment from '../../mongo/models/data/IngestEndpointEnvironment';
import IngestEndpointRevision from '../../mongo/models/data/IngestEndpointRevision';
import IngestEndpoint from '../../mongo/models/data/IngestEndpoint';
import Route53Service from '../../aws/Route53Service';
import { BigQuery } from '@google-cloud/bigquery';
import userMessages from '../../errors/UserMessages';
import { uploadCertificate } from '../../utils/CertificateUtils';
import {
    buildIngestEndpointConfig,
    createIngestEndpointEnvironment,
    getIngestEndpointCNAME,
    getIngestEndpointInstallDomain,
} from '../../utils/IngestEndpointEnvironmentUtils';
import { StorageProvider } from '../../enums/StorageProvider';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';
import { withUnManagedAccount } from '../../utils/DataManagerAccountUtils';
import Hash from '../../core/Hash';
import { ClickHouse } from 'clickhouse';

@injectable()
export default class IngestEndpointEnvironmentManager extends Manager<IngestEndpointEnvironment> {
    @inject(TYPES.S3Service) private s3Service!: S3Service;
    @inject(TYPES.Route53Service) private route53Service!: Route53Service;
    @inject(TYPES.BackendDatabase) private backendDatabase!: BaseDatabase;

    protected gqlSchema = gql`
        """
        In order to use AWS as your storage engine, you will need to create an AWS account and create a new service account for Scale8. Please see our documentation on how to configure this.
        """
        input AWSStorageConfig {
            """
            Your AWS access key. We recommend following our tutorial and creating Scale8 credentials to be used with the region / bucket selected only. We only require the ability to list and add files. We never require the ability to read your data.
            """
            access_key_id: String!
            """
            Your AWS secret key.
            """
            secret_access_key: String!
            """
            The AWS region in which you want the data to be placed and your bucket has been created.
            """
            region: AWSRegion!
            """
            An optional path prefix. By default the path prefix is '/'
            """
            path_prefix: String = "/"
            """
            The name of the storage bucket currently in use
            """
            bucket_name: String!
        }

        """
        BigQuery stream configuration required a Google Cloud Services account to be setup and configured. PLease follow our guide and configure this properly before attempting to use this service.
        """
        input GCBigQueryStreamConfig {
            """
            Service Account JSON for Google Cloud's BigQuery administrative role.
            """
            service_account_json: JSON!
            """
            The 'Data Set' under which a new table will be created.
            """
            data_set_name: String!
            """
            The location of the data set, if it doesn't exist, we'll try and create it using the location specified
            """
            data_set_location: String = "US"
            """
            If this is set to true, a WHERE clause will be required when querying data in order to reduce costs. See BigQuery documentation for more details.
            """
            require_partition_filter_in_queries: Boolean = false
        }

        """
        In order to use MongoDB as your storage engine, you just need to provide connection string and database name.
        """
        input MongoDbPushConfig {
            """
            Your MongoDB server connection string.
            """
            connection_string: String!
            """
            The name of the database that will store your data
            """
            database_name: String!
        }

        """
        In order to use ClickHouse as your storage engine, you just need to provide connection details and credentials.
        """
        input ClickHouseStreamConfig {
            """
            Your ClickHouse server url.
            """
            url: String!
            """
            Your ClickHouse server port.
            """
            port: Int!
            """
            Your ClickHouse basicAuth username.
            """
            username: String!
            """
            Your ClickHouse basicAuth password.
            """
            password: String!
        }

        """
        @model
        This entity holds the nessessary configuration to configure the \`IngestEndpoint\` for deployment. Please note that we are unable to retrieve cert_pem and key_pem in this model as a security precaution. There is no API access to our encrypted vault where we hold secure information.
        """
        type IngestEndpointEnvironment {
            """
            ID of the \`IngestEndpointEnvironment\`
            """
            id: ID!
            """
            Name of the \`IngestEndpointEnvironment\`
            """
            name: String!
            """
            A custom domain name associated with this \`IngestEndpointEnvironment\`
            """
            custom_domain: String
            """
            \`IngestEndpointEnvironment\`'s install domain used to push data to
            """
            install_domain: String!
            """
            \`IngestEndpointEnvironment\`'s CNAME
            """
            cname: String!
            """
            The storage provider used by the \`IngestEndpointEnvironment\` to store ingested data
            """
            storage_provider: StorageProvider!
            """
            The \`IngestEndpointRevision\` currently bound to the \`IngestEndpointEnvironment\`
            """
            ingest_endpoint_revision: IngestEndpointRevision!
            """
            A hint of the credentials currently in use by the \`IngestEndpointEnvironment\`. For security reasons we don't enable to full retrival of this information via the API. It does not persist in our database or servers and remains in our vault.
            """
            config_hint: String!
            """
            Date the \`IngestEndpointEnvironment\` was created
            """
            created_at: DateTime!
            """
            Date the \`IngestEndpointEnvironment\` last updated
            """
            updated_at: DateTime!
            """
            Request stats - Please note that environment is automatically applied in the filter
            """
            request_stats(query_options: IngestQueryOptions!): GroupingCountsResponse!
            """
            Byte stats - Please note that environment is automatically applied in the filter
            """
            byte_stats(query_options: IngestQueryOptions!): GroupingCountsResponse!
        }

        """
        Multiple deployments can be configured here, the same \`IngestEndpoint\` can be configured to work with different engines and adapted to your own specific use cases. A storage engine must be provided however to successfully create and configure and new environment.
        """
        input IngestEndpointEnvironmentCreateInput {
            """
            The ID of the \`IngestEndpoint\` under which the new \`IngestEndpointEnvironment\` should be created
            """
            ingest_endpoint_id: ID!
            """
            Name of the new \`IngestEndpointEnvironment\`
            """
            name: String!
            """
            A custom domain name to be associated with this \`IngestEndpointEnvironment\`
            """
            custom_domain: String
            """
            If a custom domain is provided, a certificate is required to handle secure web traffic
            """
            cert_pem: String
            """
            If a custom domain is provided, a key is required to handle secure web traffic
            """
            key_pem: String
            """
            The storage provider to be used by the \`IngestEndpointEnvironment\` to store ingested data
            """
            storage_provider: StorageProvider!
            """
            The \`IngestEndpointRevision\` ID to be linked to the new \`IngestEndpointEnvironment\`
            """
            ingest_endpoint_revision_id: ID!
            """
            The AWS specific configuration linked to this new \`IngestEndpointEnvironment\`
            """
            aws_storage_config: AWSStorageConfig
            """
            The Google Cloud BigQuery Stream specific configuration linked to this new \`IngestEndpointEnvironment\`
            """
            gc_bigquery_stream_config: GCBigQueryStreamConfig
            """
            The MongoDB specific configuration linked to this new \`IngestEndpointEnvironment\`
            """
            mongo_push_config: MongoDbPushConfig
            """
            The ClickHouse specific configuration linked to this new \`IngestEndpointEnvironment\`
            """
            clickhouse_stream_config: ClickHouseStreamConfig
        }

        """
        Deleting an environment will remove the deployment permanently. It will not delete the information from your storage/stream engines however. We will make no attempt to clean and data from your cloud services.
        """
        input IngestEndpointEnvironmentDeleteInput {
            """
            ID of the \`IngestEndpointEnvironment\` to be deleted
            """
            ingest_endpoint_environment_id: ID!
        }

        """
        We do not currently allow changes to a storage engine to be made, doing so could cause a number of potential issues. If you find yourself requiring any assistance, please contact us and we'll do our best to support your setup issues.
        """
        input IngestEndpointEnvironmentUpdateInput {
            """
            ID of the \`IngestEndpointEnvironment\`
            """
            ingest_endpoint_environment_id: ID!
            """
            ID of the \`IngestEndpointRevision\` to attach to the \`IngestEndpointEnvironment\`
            """
            ingest_endpoint_revision_id: ID!
            """
            \`IngestEndpointEnvironment\` name
            """
            name: String
            """
            If a custom domain is used a new certificate can be installed which will replace the exiting one
            """
            cert_pem: String
            """
            If a custom domain is used a new key can be installed which will replace the exiting one
            """
            key_pem: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=IngestEndpointEnvironment
            Create a new \`IngestEndpointEnvironment\`.
            """
            createIngestEndpointEnvironment(
                ingestEndpointEnvironmentCreateInput: IngestEndpointEnvironmentCreateInput!
            ): IngestEndpointEnvironment!
            """
            @bound=IngestEndpointEnvironment
            Delete a \`IngestEndpointEnvironment\`.
            """
            deleteIngestEndpointEnvironment(
                ingestEndpointEnvironmentDeleteInput: IngestEndpointEnvironmentDeleteInput!
            ): Boolean!
            """
            @bound=IngestEndpointEnvironment
            Update a \`IngestEndpointEnvironment\`.
            """
            updateIngestEndpointEnvironment(
                ingestEndpointEnvironmentUpdateInput: IngestEndpointEnvironmentUpdateInput!
            ): Boolean!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=IngestEndpointEnvironment
            Get an \`IngestEndpointEnvironment\` model from \`IngestEndpointEnvironment\` ID
            """
            getIngestEndpointEnvironment(id: ID!): IngestEndpointEnvironment!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getIngestEndpointEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const ingestEndpointEnvironment = await this.repoFactory(
                IngestEndpointEnvironment,
            ).findByIdThrows(new ObjectID(args.id), userMessages.environmentFailed);
            return await this.orgAuth.asUserWithViewAccess(
                ctx,
                ingestEndpointEnvironment.orgId,
                async () => ingestEndpointEnvironment.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateIngestEndpointEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointEnvironmentUpdateInput;
            const ingestEndpointEnvironment = await this.repoFactory(
                IngestEndpointEnvironment,
            ).findByIdThrows(
                new ObjectID(data.ingest_endpoint_environment_id),
                userMessages.environmentFailed,
            );
            return withUnManagedAccount(ingestEndpointEnvironment.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithEditAccess(
                    ctx,
                    ingestEndpointEnvironment.orgId,
                    async (me) => {
                        if (
                            this.config.isCommercial() &&
                            data.cert_pem !== undefined &&
                            data.key_pem !== undefined
                        ) {
                            //trying to install a new certificate...
                            if (ingestEndpointEnvironment.customDomain === undefined) {
                                throw new GQLError(userMessages.noCustomDomain, true);
                            } else {
                                await uploadCertificate(
                                    ingestEndpointEnvironment.customDomain,
                                    data.cert_pem,
                                    data.key_pem,
                                );
                            }
                        }
                        ingestEndpointEnvironment.bulkGQLSet(data, ['name']);

                        //we are trying to attach a new revision to this environment
                        const revision = await this.repoFactory(
                            IngestEndpointRevision,
                        ).findOneThrows(
                            {
                                _id: new ObjectID(data.ingest_endpoint_revision_id),
                                _ingest_endpoint_id: ingestEndpointEnvironment.ingestEndpointId,
                            },
                            userMessages.revisionFailed,
                        );

                        //we need to check this revision is ok to attach...
                        if (revision.isFinal) {
                            ingestEndpointEnvironment.ingestEndpointRevisionId = revision.id;
                            await this.repoFactory(IngestEndpointEnvironment).save(
                                ingestEndpointEnvironment,
                                me,
                            );
                            //now build the config...
                            await buildIngestEndpointConfig(ingestEndpointEnvironment);
                        } else {
                            throw new GQLError(userMessages.revisionNotFinalAttaching, true);
                        }

                        return true;
                    },
                ),
            );
        },
        deleteIngestEndpointEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointEnvironmentDeleteInput;
            const ingestEndpointEnvironment = await this.repoFactory(
                IngestEndpointEnvironment,
            ).findByIdThrows(
                new ObjectID(data.ingest_endpoint_environment_id),
                userMessages.environmentFailed,
            );
            return withUnManagedAccount(ingestEndpointEnvironment.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithDeleteAccess(
                    ctx,
                    ingestEndpointEnvironment.orgId,
                    async (me) => {
                        await this.repoFactory(IngestEndpointEnvironment).delete(
                            ingestEndpointEnvironment,
                            me,
                        );
                        return true;
                    },
                ),
            );
        },
        createIngestEndpointEnvironment: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointEnvironmentCreateInput;
            const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                new ObjectID(data.ingest_endpoint_id),
                userMessages.ingestEndpointFailed,
            );
            return withUnManagedAccount(ingestEndpoint.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithCreateAccess(ctx, ingestEndpoint.orgId, async (me) => {
                    const getProviderConfig = async (): Promise<{
                        config: Record<string, unknown>;
                        hint: string;
                    }> => {
                        if (
                            data.storage_provider === StorageProvider.AWS_S3 &&
                            data.aws_storage_config !== undefined
                        ) {
                            return await this.getAwsS3ProviderConfig(data.aws_storage_config);
                        } else if (
                            data.storage_provider === StorageProvider.GC_BIGQUERY_STREAM &&
                            data.gc_bigquery_stream_config !== undefined
                        ) {
                            return await IngestEndpointEnvironmentManager.getBigQueryProviderConfig(
                                data.gc_bigquery_stream_config,
                            );
                        } else if (
                            data.storage_provider === StorageProvider.MONGODB &&
                            data.mongo_push_config !== undefined
                        ) {
                            return await IngestEndpointEnvironmentManager.getMongoDbProviderConfig(
                                data.mongo_push_config,
                            );
                        } else if (
                            data.storage_provider === StorageProvider.CLICKHOUSE &&
                            data.clickhouse_stream_config !== undefined
                        ) {
                            return await IngestEndpointEnvironmentManager.getClickHouseProviderConfig(
                                data.clickhouse_stream_config,
                            );
                        } else {
                            throw new GQLError(userMessages.noStorageProvider, true);
                        }
                    };
                    const providerConfig = await getProviderConfig();

                    const ingestEndpointRevision: IngestEndpointRevision = await this.repoFactory(
                        IngestEndpointRevision,
                    ).findByIdThrows(
                        new ObjectID(data.ingest_endpoint_revision_id),
                        userMessages.revisionFailed,
                    );

                    return (
                        await createIngestEndpointEnvironment(
                            me,
                            ingestEndpoint,
                            data.name,
                            data.storage_provider,
                            providerConfig,
                            ingestEndpointRevision,
                            undefined,
                            this.config.isCommercial() ? data.custom_domain : undefined,
                            this.config.isCommercial() ? data.cert_pem : undefined,
                            this.config.isCommercial() ? data.key_pem : undefined,
                        )
                    ).toGQLType();
                }),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        IngestEndpointEnvironment: {
            cname: async (parent: any) => getIngestEndpointCNAME(parent.id),
            install_domain: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(IngestEndpointEnvironment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () =>
                    getIngestEndpointInstallDomain(env),
                );
            },
            ingest_endpoint_revision: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(IngestEndpointEnvironment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    return env.ingestEndpointRevisionId === undefined
                        ? null
                        : (
                              await this.repoFactory(IngestEndpointRevision).findByIdThrows(
                                  env.ingestEndpointRevisionId,
                                  userMessages.revisionFailed,
                              )
                          ).toGQLType();
                });
            },
            request_stats: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(IngestEndpointEnvironment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    args.query_options.filter_options.environment = env.id.toString();
                    return this.backendDatabase.requests(
                        await this.repoFactory(IngestEndpoint).findByIdThrows(
                            env.ingestEndpointId,
                            userMessages.ingestEndpointFailed,
                        ),
                        args.query_options,
                    );
                });
            },
            byte_stats: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(IngestEndpointEnvironment).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.environmentFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    args.query_options.filter_options.environment = env.id.toString();
                    return this.backendDatabase.bytes(
                        await this.repoFactory(IngestEndpoint).findByIdThrows(
                            env.ingestEndpointId,
                            userMessages.ingestEndpointFailed,
                        ),
                        args.query_options,
                    );
                });
            },
        },
    };

    private async getAwsS3ProviderConfig(awsStorageConfig: any) {
        //we need to test AWS setup is correct...
        const s3 = this.s3Service.getS3Client(
            awsStorageConfig.access_key_id,
            awsStorageConfig.secret_access_key,
            awsStorageConfig.region,
        );
        if (!(await this.s3Service.bucketExists(s3, awsStorageConfig.bucket_name))) {
            throw new GQLError(userMessages.awsNoBucket(awsStorageConfig.bucket_name), true);
        }
        if (!(await this.s3Service.isWriteable(s3, awsStorageConfig.bucket_name))) {
            throw new GQLError(userMessages.awsBucketCantWrite(awsStorageConfig.bucket_name), true);
        }
        return {
            config: awsStorageConfig,
            hint: `Using AWS Access Key: ${awsStorageConfig.access_key_id}`,
        };
    }

    private static async getBigQueryProviderConfig(bigqueryStreamConfig: any) {
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
    }

    private static async getMongoDbProviderConfig(mongoPushConfig: any) {
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
    }

    private static async getClickHouseProviderConfig(clickhouseStreamConfig: any) {
        const clickhouse = new ClickHouse({
            url: clickhouseStreamConfig.url,
            port: clickhouseStreamConfig.port,
            debug: false,
            basicAuth: {
                username: clickhouseStreamConfig.username,
                password: clickhouseStreamConfig.password,
            },
            isUseGzip: false,
            format: 'json',
            raw: false,
        });

        try {
            await clickhouse.query('show databases').toPromise();
        } catch (e) {
            throw new GQLError(
                userMessages.clickHouseServerVerificationFailure(clickhouseStreamConfig.url),
                true,
            );
        }

        return {
            config: clickhouseStreamConfig,
            hint: `Using ClickHouse Server At: ${clickhouseStreamConfig.url}`,
        };
    }
}
