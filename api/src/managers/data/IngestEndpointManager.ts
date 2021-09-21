import { inject, injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import IngestEndpoint from '../../mongo/models/data/IngestEndpoint';
import DataManagerAccount from '../../mongo/models/data/DataManagerAccount';
import IngestEndpointRevision from '../../mongo/models/data/IngestEndpointRevision';
import IngestEndpointEnvironment from '../../mongo/models/data/IngestEndpointEnvironment';
import DataError from '../../errors/DataError';
import userMessages from '../../errors/UserMessages';
import User from '../../mongo/models/User';
import { fetchOrg } from '../../utils/OrgUtils';
import Org from '../../mongo/models/Org';
import {
    createUsageEndpointEnvironment,
    getCommercialStorageProvider,
    getCommercialStorageProviderConfig,
    getProviderConfig,
    getUpdateProviderConfig,
    updateIngestEndpointEnvironment,
} from '../../utils/IngestEndpointEnvironmentUtils';
import { VarType } from '../../enums/VarType';
import TYPES from '../../container/IOC.types';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';
import { withUnManagedAccount } from '../../utils/DataManagerAccountUtils';
import { StorageProvider } from '../../enums/StorageProvider';
import { StorageProviderConfig } from '../../mongo/types/Types';
import GenericError from '../../errors/GenericError';
import { LogPriority } from '../../enums/LogPriority';
import Hash from '../../core/Hash';

@injectable()
export default class IngestEndpointManager extends Manager<IngestEndpoint> {
    @inject(TYPES.BackendDatabaseFactory) private backendDatabaseFactory!: (
        storage_provider: StorageProvider,
    ) => BaseDatabase;

    protected gqlSchema = gql`
        """
        Options to add filter values on IngestQueryOptions.
        """
        input IngestQueryFilterOptions {
            """
            DateTime the stats range should start
            """
            from: DateTime!
            """
            DateTime the stats range should finish
            """
            to: DateTime!
            revision: ID
            environment: ID
        }

        """
        Options to query stats.
        """
        input IngestQueryOptions {
            time_slice: TimeSlice = DAY
            filter_options: IngestQueryFilterOptions!
            limit: Int = 10000
        }

        """
        @model
        This entity sits under the \`DataManagerAccount\` entity. It links all the revisions and environments associated with it and also provides a basic usage summary.
        """
        type IngestEndpoint {
            """
            ID of the \`IngestEndpoint\`
            """
            id: ID!
            """
            Name of the \`IngestEndpoint\`
            """
            name: String!
            """
            The \`DataManagerAccount\` that contains the \`IngestEndpoint\`
            """
            data_manager_account: DataManagerAccount!
            """
            The \`IngestEndpointRevision\`s connected to the \`IngestEndpoint\`
            """
            ingest_endpoint_revisions: [IngestEndpointRevision!]!
            """
            The \`IngestEndpointEnvironment\`s owned by the \`IngestEndpoint\`
            """
            ingest_endpoint_environments: [IngestEndpointEnvironment!]!
            """
            Date the \`IngestEndpoint\` was created
            """
            created_at: DateTime!
            """
            Date the \`IngestEndpoint\` was last updated
            """
            updated_at: DateTime!
            """
            Request stats
            """
            request_stats(query_options: IngestQueryOptions!): GroupingCountsResponse!
            """
            Byte stats
            """
            byte_stats(query_options: IngestQueryOptions!): GroupingCountsResponse!
            """
            Whether the analytics on the \`IngestEndpoint\` is enabled
            """
            analytics_enabled: Boolean!
            """
            The storage provider used by the \`IngestEndpoint\` to track data
            """
            storage_provider: StorageProvider!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=IngestEndpoint
            """
            getIngestEndpoint(id: ID!): IngestEndpoint!
        }

        """
        Data structure for creating a new \`IngestEndpoint\`. This new entity is then used to contain both revisions and environments.
        """
        input IngestEndpointCreateInput {
            """
            The \`DataManagerAccount\` under which the \`IngestEndpoint\` should be created
            """
            data_manager_account_id: ID!
            """
            The name of the new \`IngestEndpoint\` being created
            """
            name: String!
            """
            The storage provider to be used by the \`App\` to store analytics data
            """
            storage_provider: StorageProvider
            """
            The AWS specific configuration linked to this new \`App\`
            """
            aws_storage_config: AWSStorageConfig
            """
            The Google Cloud BigQuery Stream specific configuration linked to this new \`App\`
            """
            gc_bigquery_stream_config: GCBigQueryStreamConfig
            """
            The MongoDB specific configuration linked to this new \`App\`
            """
            mongo_push_config: MongoDbPushConfig
            """
            If the analytics on the \`IngestEndpoint\` should be enabled
            """
            analytics_enabled: Boolean!
        }

        """
        Data structure for deleting an existing \`IngestEndpoint\`. It will remove all child entities, however no attempt will be made to clean any data from your storage engines / streams that are linked at the environment level. There is no flag supposed to clean up data in your services.
        """
        input IngestEndpointDeleteInput {
            """
            \`IngestEndpoint\` ID to delete against
            """
            ingest_endpoint_id: ID!
        }

        """
        Data structure for updating of properties associated with this entity.
        """
        input IngestEndpointUpdateInput {
            """
            \`IngestEndpoint\` ID to update data against
            """
            ingest_endpoint_id: ID!
            """
            \`IngestEndpoint\` name
            """
            name: String
            """
            The storage provider to be used by the \`App\` to store analytics data
            """
            storage_provider: StorageProvider
            """
            The AWS specific configuration linked to this new \`App\`
            """
            aws_storage_config: AWSStorageConfig
            """
            The Google Cloud BigQuery Stream specific configuration linked to this new \`App\`
            """
            gc_bigquery_stream_config: GCBigQueryStreamConfig
            """
            The MongoDB specific configuration linked to this new \`App\`
            """
            mongo_push_config: MongoDbPushConfig
            """
            If the analytics on the \`IngestEndpoint\` should be enabled
            """
            analytics_enabled: Boolean!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=IngestEndpoint
            Create a new \`IngestEndpoint\`.
            """
            createIngestEndpoint(
                ingestEndpointCreateInput: IngestEndpointCreateInput!
            ): IngestEndpoint!
            """
            @bound=IngestEndpoint
            Update a \`IngestEndpoint\`'s details.
            """
            updateIngestEndpoint(ingestEndpointUpdateInput: IngestEndpointUpdateInput!): Boolean!
            """
            @bound=IngestEndpoint
            Delete a \`IngestEndpoint\` and its children.
            """
            deleteIngestEndpoint(ingestEndpointDeleteInput: IngestEndpointDeleteInput!): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        deleteIngestEndpoint: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointDeleteInput;
            const ingestEndpoint = await this.findAndCheckIngestEndpoint(data);
            return this.orgAuth.asUserWithDeleteAccess(ctx, ingestEndpoint.orgId, async (me) => {
                //TODO - clean up children. We can't easily automate this task as IngestEndpoint is not revised
                await this.repoFactory(IngestEndpoint).delete(ingestEndpoint, me);
                return true;
            });
        },
        updateIngestEndpoint: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointUpdateInput;
            const ingestEndpoint = await this.findAndCheckIngestEndpoint(data);

            return this.orgAuth.asUserWithEditAccess(ctx, ingestEndpoint.orgId, async (me) => {
                if (ingestEndpoint.usageIngestEndpointEnvironmentId === undefined) {
                    throw new GenericError(
                        `Failed to get usage Ingest Endpoint for Ingest Endpoint: ${ingestEndpoint.id.toString()}`,
                        LogPriority.DEBUG,
                    );
                }

                const trackingIngestEndpointEnvironment = await this.repoFactory(
                    IngestEndpointEnvironment,
                ).findByIdThrows(
                    ingestEndpoint.usageIngestEndpointEnvironmentId,
                    userMessages.usageFailed,
                );

                const providerConfig = await getUpdateProviderConfig(
                    data,
                    trackingIngestEndpointEnvironment,
                );

                await updateIngestEndpointEnvironment(
                    me,
                    trackingIngestEndpointEnvironment,
                    providerConfig,
                );

                ingestEndpoint.bulkGQLSet(data, ['name', 'analytics_enabled']); //only is a safety check against this function
                ingestEndpoint.storageProviderConfigHash = Hash.hashString(
                    JSON.stringify(providerConfig),
                    'c0nF1g',
                );
                await this.repoFactory(IngestEndpoint).save(ingestEndpoint, me);
                return true;
            });
        },
        createIngestEndpoint: async (parent: any, args: any, ctx: CTX) => {
            const createIngestUsageEndpointEnvironment = async (
                org: Org,
                trackingEntity: IngestEndpoint,
                actor: User,
                provider: StorageProvider,
                providerConfig: StorageProviderConfig,
            ): Promise<IngestEndpointEnvironment> => {
                return createUsageEndpointEnvironment(
                    org,
                    trackingEntity,
                    actor,
                    provider,
                    providerConfig,
                    [
                        {
                            varType: VarType.DATETIME,
                            key: 'dt',
                            defaultValue: '%S8_DATE_TIME_UTC%',
                        },
                        {
                            varType: VarType.STRING,
                            key: 'env_id',
                            defaultValue: '%S8_INGEST_ENV_ID%',
                        },
                        {
                            varType: VarType.STRING,
                            key: 'revision_id',
                            defaultValue: '%S8_INGEST_REVISION_ID%',
                        },
                        {
                            varType: VarType.INT,
                            key: 'requests',
                            defaultValue: 1,
                        },
                        {
                            varType: VarType.INT,
                            key: 'bytes',
                        },
                    ],
                );
            };

            const createIngestEndpoint = async (
                actor: User,
                dataManagerAccount: DataManagerAccount,
                name: string,
                provider: StorageProvider,
                providerConfig: StorageProviderConfig,
                analyticsEnabled: boolean,
            ): Promise<IngestEndpoint> => {
                let ingestEndpoint = await this.repoFactory(IngestEndpoint).save(
                    new IngestEndpoint(name, dataManagerAccount, analyticsEnabled, provider),
                    actor,
                );
                //we need to create an ingest endpoint environment to track usage...
                const usageEndpointEnvironment = await createIngestUsageEndpointEnvironment(
                    await fetchOrg(dataManagerAccount.orgId),
                    ingestEndpoint,
                    actor,
                    provider,
                    providerConfig,
                );
                ingestEndpoint.usageIngestEndpointEnvironmentId = usageEndpointEnvironment.id;
                ingestEndpoint.storageProviderConfigHash = Hash.hashString(
                    JSON.stringify(providerConfig),
                    'c0nF1g',
                );
                ingestEndpoint = await this.repoFactory(IngestEndpoint).save(ingestEndpoint, actor);
                await this.repoFactory(IngestEndpointRevision).save(
                    new IngestEndpointRevision('Revision 1', ingestEndpoint),
                    actor,
                );
                return ingestEndpoint;
            };

            const data = args.ingestEndpointCreateInput;

            const getStorageProviderDetails = async (): Promise<
                [StorageProvider, StorageProviderConfig]
            > => {
                if (this.config.isCommercial()) {
                    return [
                        getCommercialStorageProvider(),
                        await getCommercialStorageProviderConfig(),
                    ];
                }

                return [data.storage_provider, await getProviderConfig(data)];
            };

            const [storageProvider, providerConfig] = await getStorageProviderDetails();

            const dataManagerAccount = await this.repoFactory(DataManagerAccount).findByIdThrows(
                new ObjectId(data.data_manager_account_id),
                userMessages.accountFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(
                ctx,
                dataManagerAccount.orgId,
                async (me) => {
                    if (
                        (await this.repoFactory(IngestEndpoint).count({
                            _data_manager_account_id: dataManagerAccount.id,
                        })) >= (await this.config.getMaxIngestEndpoints())
                    ) {
                        throw new DataError(userMessages.maxEndpoints, true);
                    }
                    return (
                        await createIngestEndpoint(
                            me,
                            dataManagerAccount,
                            data.name,
                            storageProvider,
                            providerConfig,
                            data.analytics_enabled,
                        )
                    ).toGQLType();
                },
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getIngestEndpoint: async (parent: any, args: any, ctx: CTX) => {
            const id = new ObjectID(args.id);
            const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                id,
                userMessages.ingestEndpointFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, ingestEndpoint.orgId, async () =>
                ingestEndpoint.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        IngestEndpoint: {
            ingest_endpoint_revisions: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.ingestEndpointFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpoint.orgId,
                    async () =>
                        (
                            await this.repoFactory(IngestEndpointRevision).find({
                                _ingest_endpoint_id: ingestEndpoint.id,
                            })
                        ).map((_) => _.toGQLType()),
                );
            },
            ingest_endpoint_environments: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.ingestEndpointFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpoint.orgId,
                    async () =>
                        (
                            await this.repoFactory(IngestEndpointEnvironment).find({
                                _ingest_endpoint_id: ingestEndpoint.id,
                            })
                        ).map((_) => _.toGQLType()),
                );
            },
            data_manager_account: async (parent: any, args: any, ctx: CTX) => {
                const dataManagerAccount = await this.repoFactory(
                    DataManagerAccount,
                ).findByIdThrows(
                    new ObjectID(parent.data_manager_account_id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    dataManagerAccount.orgId,
                    async () => dataManagerAccount.toGQLType(),
                );
            },
            request_stats: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.ingestEndpointFailed,
                );
                if (ingestEndpoint.storageProvider === StorageProvider.AWS_S3) {
                    return {
                        result: [],
                        from: new Date(),
                        to: new Date(),
                    };
                }
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpoint.orgId,
                    async () =>
                        this.backendDatabaseFactory(ingestEndpoint.storageProvider).requests(
                            ingestEndpoint,
                            args.query_options,
                        ),
                );
            },
            byte_stats: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.ingestEndpointFailed,
                );
                if (ingestEndpoint.storageProvider === StorageProvider.AWS_S3) {
                    return {
                        result: [],
                        from: new Date(),
                        to: new Date(),
                    };
                }
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpoint.orgId,
                    async () =>
                        this.backendDatabaseFactory(ingestEndpoint.storageProvider).bytes(
                            ingestEndpoint,
                            args.query_options,
                        ),
                );
            },
        },
    };

    private async findAndCheckIngestEndpoint(data: any): Promise<IngestEndpoint> {
        const ingestEndpoint: IngestEndpoint = await this.repoFactory(
            IngestEndpoint,
        ).findByIdThrows(new ObjectId(data.ingest_endpoint_id), userMessages.ingestEndpointFailed);
        return withUnManagedAccount(
            ingestEndpoint.dataManagerAccountId,
            async () => ingestEndpoint,
        );
    }
}
