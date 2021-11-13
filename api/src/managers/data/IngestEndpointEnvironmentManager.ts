import { inject, injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import TYPES from '../../container/IOC.types';
import IngestEndpointEnvironment from '../../mongo/models/data/IngestEndpointEnvironment';
import IngestEndpointRevision from '../../mongo/models/data/IngestEndpointRevision';
import IngestEndpoint from '../../mongo/models/data/IngestEndpoint';
import userMessages from '../../errors/UserMessages';
import {
    createIngestEndpointEnvironment,
    getIngestEndpointCNAME,
    getIngestEndpointInstallDomain,
    getProviderConfig,
    getUpdateProviderConfig,
    updateIngestEndpointEnvironment,
} from '../../utils/IngestEndpointEnvironmentUtils';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';
import { withUnManagedAccount } from '../../utils/DataManagerAccountUtils';
import { StorageProvider } from '../../enums/StorageProvider';

@injectable()
export default class IngestEndpointEnvironmentManager extends Manager<IngestEndpointEnvironment> {
    @inject(TYPES.BackendDatabaseFactory) private backendDatabaseFactory!: (
        storage_provider: StorageProvider,
    ) => BaseDatabase;

    protected gqlSchema = gql`
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
            ).findByIdThrows(new ObjectId(args.id), userMessages.environmentFailed);
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
                new ObjectId(data.ingest_endpoint_environment_id),
                userMessages.environmentFailed,
            );
            return withUnManagedAccount(ingestEndpointEnvironment.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithEditAccess(
                    ctx,
                    ingestEndpointEnvironment.orgId,
                    async (me) => {
                        const providerConfig = await getUpdateProviderConfig(
                            data,
                            ingestEndpointEnvironment,
                        );

                        await updateIngestEndpointEnvironment(
                            me,
                            ingestEndpointEnvironment,
                            providerConfig,
                            data.name,
                            data.ingest_endpoint_revision_id,
                            this.config.isCommercial() ? data.cert_pem : undefined,
                            this.config.isCommercial() ? data.key_pem : undefined,
                        );
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
                new ObjectId(data.ingest_endpoint_environment_id),
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
                new ObjectId(data.ingest_endpoint_id),
                userMessages.ingestEndpointFailed,
            );
            return withUnManagedAccount(ingestEndpoint.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithCreateAccess(ctx, ingestEndpoint.orgId, async (me) => {
                    const providerConfig = await getProviderConfig(data);

                    const ingestEndpointRevision: IngestEndpointRevision = await this.repoFactory(
                        IngestEndpointRevision,
                    ).findByIdThrows(
                        new ObjectId(data.ingest_endpoint_revision_id),
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
                    new ObjectId(parent.id),
                    userMessages.environmentFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () =>
                    getIngestEndpointInstallDomain(env),
                );
            },
            ingest_endpoint_revision: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(IngestEndpointEnvironment).findByIdThrows(
                    new ObjectId(parent.id),
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
                    new ObjectId(parent.id),
                    userMessages.environmentFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    args.query_options.filter_options.environment = env.id.toString();
                    const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                        env.ingestEndpointId,
                        userMessages.ingestEndpointFailed,
                    );
                    if (ingestEndpoint.storageProvider === StorageProvider.AWS_S3) {
                        return {
                            result: [],
                            from: new Date(),
                            to: new Date(),
                        };
                    }
                    return this.backendDatabaseFactory(ingestEndpoint.storageProvider).requests(
                        ingestEndpoint,
                        args.query_options,
                    );
                });
            },
            byte_stats: async (parent: any, args: any, ctx: CTX) => {
                const env = await this.repoFactory(IngestEndpointEnvironment).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.environmentFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, env.orgId, async () => {
                    args.query_options.filter_options.environment = env.id.toString();
                    const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                        env.ingestEndpointId,
                        userMessages.ingestEndpointFailed,
                    );
                    if (ingestEndpoint.storageProvider === StorageProvider.AWS_S3) {
                        return {
                            result: [],
                            from: new Date(),
                            to: new Date(),
                        };
                    }
                    return this.backendDatabaseFactory(ingestEndpoint.storageProvider).bytes(
                        ingestEndpoint,
                        args.query_options,
                    );
                });
            },
        },
    };
}
