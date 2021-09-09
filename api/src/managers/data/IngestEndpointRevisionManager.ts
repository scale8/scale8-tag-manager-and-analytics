import { inject, injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import GQLError from '../../errors/GQLError';
import IngestEndpointRevision from '../../mongo/models/data/IngestEndpointRevision';
import IngestEndpointDataMap from '../../mongo/models/data/IngestEndpointDataMap';
import IngestEndpoint from '../../mongo/models/data/IngestEndpoint';
import TYPES from '../../container/IOC.types';
import userMessages from '../../errors/UserMessages';
import { revisionsJSONSafeDiff } from '../../utils/DiffUtils';
import { duplicateRevision } from '../../utils/RevisionUtils';
import { createIngestEndpointDataMapSchemasFromGQLInput } from '../../utils/IngestEndpointDataMapUtils';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';
import { withUnManagedAccount } from '../../utils/DataManagerAccountUtils';

@injectable()
export default class IngestEndpointRevisionManager extends Manager<IngestEndpointRevision> {
    @inject(TYPES.BackendDatabase) private backendDatabase!: BaseDatabase;

    protected gqlSchema = gql`
        """
        @model
        This entity contains a set of data maps (\`IngestEndpointDataMap\`). These describe the supported payload structure.
        """
        type IngestEndpointRevision {
            """
            ID of the \`IngestEndpointRevision\`
            """
            id: ID!
            """
            Name of the \`IngestEndpointRevision\`
            """
            name: String!
            """
            The \`IngestEndpointRevision\` has been finalised and locked to prevent further changes
            """
            locked: Boolean!
            """
            The \`IngestEndpoint\` that the \`IngestEndpointRevision\` belongs to
            """
            ingest_endpoint: IngestEndpoint!
            """
            The \`IngestEndpointDataMaps\`s that construct the payload (key => value) configuration for the \`IngestEndpointRevision\`
            """
            ingest_endpoint_data_maps: [IngestEndpointDataMap!]!
            """
            Date the \`IngestEndpointRevision\` was created
            """
            created_at: DateTime!
            """
            Date the \`IngestEndpointRevision\` was last updated
            """
            updated_at: DateTime!
            """
            Request stats - Please note that revision is automatically applied in the filter
            """
            request_stats(query_options: IngestQueryOptions!): GroupingCountsResponse!
            """
            Byte stats - Please note that revision is automatically applied in the filter
            """
            byte_stats(query_options: IngestQueryOptions!): GroupingCountsResponse!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=IngestEndpointRevision
            Get a \`IngestEndpointRevision\` by it's ID
            """
            getIngestEndpointRevision(id: ID!): IngestEndpointRevision!
            """
            @bound=IngestEndpointRevision
            Provides the left and right comparison of two revisions
            """
            ingestEndpointRevisionDifference(
                leftRevisionId: ID!
                rightRevisionId: ID!
            ): [RevisionDiff!]!
        }

        """
        Data structure for duplicating an existing revision. This will clone the entire structure and change the name if 'new_name' is provided.
        """
        input DuplicateIngestEndpointRevisionInput {
            """
            ID of the \`IngestEndpointRevision\` to be duplicated
            """
            ingest_endpoint_revision_id: ID!
            """
            Optionally provide a new name for the \`IngestEndpointRevision\`
            """
            new_name: String
        }

        """
        Data structure for finalising a revision. This action is final and can't be undone. Once locked the revision can be attached to an environment.
        """
        input FinaliseIngestEndpointRevisionInput {
            """
            ID of the \`IngestEndpointRevision\` to be finalised
            """
            ingest_endpoint_revision_id: ID!
        }

        """
        Data structure for updating a revision. The only property that can be changed directly is the name of the revision.
        """
        input IngestEndpointRevisionUpdateInput {
            """
            \`IngestEndpointRevision\` ID to update data against
            """
            ingest_endpoint_revision_id: ID!
            """
            \`IngestEndpointRevision\` name
            """
            name: String
        }

        """
        Data structure for creating new data maps and linking this directly the the revision. To add a child data map, this will need to be attached directly to the parent. Please see \`IngestEndpointDataMap\`.
        """
        input IngestEndpointAddIngestEndpointDataMapsInput {
            """
            \`IngestEndpointRevision\` ID to update data against
            """
            ingest_endpoint_revision_id: ID!
            """
            \`IngestEndpointRevision\` name
            """
            ingest_endpoint_data_maps: [IngestEndpointDataMapInput!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=IngestEndpointRevision
            Duplicating a \`IngestEndpointRevision\` will clone any linked items and return a new \`IngestEndpointRevision\`
            """
            duplicateIngestEndpointRevision(
                duplicateIngestEndpointRevisionInput: DuplicateIngestEndpointRevisionInput
            ): Revision!
            """
            @bound=IngestEndpointRevision
            To link a \`IngestEndpointRevision\` to a \`IngestEndpointEnvironment\` it must be 'locked', i.e in its final state
            """
            finaliseIngestEndpointRevision(
                finaliseIngestEndpointRevisionInput: FinaliseIngestEndpointRevisionInput
            ): Boolean!
            """
            @bound=IngestEndpointRevision
            Update a \`IngestEndpointRevision\`'s details.
            """
            updateIngestEndpointRevision(
                ingestEndpointRevisionUpdateInput: IngestEndpointRevisionUpdateInput
            ): Boolean!
            """
            @bound=IngestEndpointRevision
            Add one or more \`IngestEndpointDataMap\`s to the \`IngestEndpointRevision\`.
            """
            addIngestEndpointDataMaps(
                ingestEndpointAddIngestEndpointDataMapsInput: IngestEndpointAddIngestEndpointDataMapsInput
            ): [IngestEndpointDataMap!]!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        addIngestEndpointDataMaps: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointAddIngestEndpointDataMapsInput;
            const ingestEndpointRevision = await this.repoFactory(
                IngestEndpointRevision,
            ).findByIdThrows(
                new ObjectId(data.ingest_endpoint_revision_id),
                userMessages.revisionFailed,
            );
            return withUnManagedAccount(ingestEndpointRevision.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithEditAccess(ctx, ingestEndpointRevision.orgId, async (me) => {
                    const ingestEndpointDataMaps =
                        await createIngestEndpointDataMapSchemasFromGQLInput(
                            me,
                            ingestEndpointRevision,
                            data.ingest_endpoint_data_maps,
                        );
                    //return the new ingestEndpoint data maps...
                    return ingestEndpointDataMaps.map((_) => _.toGQLType());
                }),
            );
        },
        updateIngestEndpointRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointRevisionUpdateInput;
            const ingestEndpointRevision = await this.repoFactory(
                IngestEndpointRevision,
            ).findByIdThrows(
                new ObjectId(data.ingest_endpoint_revision_id),
                userMessages.revisionFailed,
            );
            return withUnManagedAccount(ingestEndpointRevision.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithEditAccess(ctx, ingestEndpointRevision.orgId, async (me) => {
                    ingestEndpointRevision.bulkGQLSet(data, ['name']); //only is a safety check against this function
                    await this.repoFactory(IngestEndpointRevision).save(ingestEndpointRevision, me);
                    return true;
                }),
            );
        },
        duplicateIngestEndpointRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.duplicateIngestEndpointRevisionInput;
            const ingestEndpointRevision = await this.repoFactory(
                IngestEndpointRevision,
            ).findByIdThrows(
                new ObjectId(data.ingest_endpoint_revision_id),
                userMessages.revisionFailed,
            );
            return withUnManagedAccount(ingestEndpointRevision.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithCreateAccess(
                    ctx,
                    ingestEndpointRevision.orgId,
                    async (me) => {
                        const newIngestEndpointRevision = await duplicateRevision(
                            me,
                            ingestEndpointRevision,
                        );
                        if (typeof data.new_name === 'string') {
                            newIngestEndpointRevision.name = data.new_name;
                            return (
                                await this.repoFactory(IngestEndpointRevision).save(
                                    newIngestEndpointRevision,
                                    me,
                                )
                            ).toGQLType();
                        } else {
                            return newIngestEndpointRevision.toGQLType();
                        }
                    },
                ),
            );
        },
        finaliseIngestEndpointRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.finaliseIngestEndpointRevisionInput;
            const ingestEndpointRevision = await this.repoFactory(
                IngestEndpointRevision,
            ).findByIdThrows(
                new ObjectId(data.ingest_endpoint_revision_id),
                userMessages.revisionFailed,
            );
            return withUnManagedAccount(ingestEndpointRevision.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithEditAccess(ctx, ingestEndpointRevision.orgId, async (me) => {
                    ingestEndpointRevision.isFinal = true;
                    await this.repoFactory(IngestEndpointRevision).save(ingestEndpointRevision, me);
                    return true;
                }),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getIngestEndpointRevision: async (parent: any, args: any, ctx: CTX) => {
            const id = new ObjectID(args.id);
            const revision = await this.repoFactory(IngestEndpointRevision).findByIdThrows(
                id,
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                revision.toGQLType(),
            );
        },
        ingestEndpointRevisionDifference: async (parent: any, args: any, ctx: CTX) => {
            const left = await this.repoFactory(IngestEndpointRevision).findByIdThrows(
                new ObjectID(args.leftRevisionId),
                userMessages.revisionFailed,
            );
            const right = await this.repoFactory(IngestEndpointRevision).findByIdThrows(
                new ObjectID(args.rightRevisionId),
                userMessages.revisionFailed,
            );
            if (left.dataManagerAccountId.toString() !== right.dataManagerAccountId.toString()) {
                throw new GQLError(userMessages.incompatibleRevisions, true);
            }
            return this.orgAuth.asUserWithViewAccess(ctx, left.orgId, async () => {
                return await revisionsJSONSafeDiff(left, right);
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        IngestEndpointRevision: {
            ingest_endpoint_data_maps: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(IngestEndpointRevision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                    (
                        await this.repoFactory(IngestEndpointDataMap).findByIds(
                            revision.ingestEndpointDataMapIds,
                        )
                    ).map((_) => _.toGQLType()),
                );
            },
            ingest_endpoint: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                    new ObjectID(parent.ingest_endpoint_id),
                    userMessages.ingestEndpointFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpoint.orgId,
                    async () => ingestEndpoint.toGQLType(),
                );
            },
            request_stats: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(IngestEndpointRevision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () => {
                    const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                        revision.ingestEndpointId,
                        userMessages.ingestEndpointFailed,
                    );
                    args.query_options.filter_options.revision = revision.id.toString();
                    return this.backendDatabase.requests(ingestEndpoint, args.query_options);
                });
            },
            byte_stats: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(IngestEndpointRevision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () => {
                    const ingestEndpoint = await this.repoFactory(IngestEndpoint).findByIdThrows(
                        revision.ingestEndpointId,
                        userMessages.ingestEndpointFailed,
                    );
                    args.query_options.filter_options.revision = revision.id.toString();
                    return this.backendDatabase.bytes(ingestEndpoint, args.query_options);
                });
            },
        },
    };
}
