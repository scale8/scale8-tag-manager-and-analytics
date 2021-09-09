import Manager from '../../abstractions/Manager';
import { inject, injectable } from 'inversify';
import Revision from '../../mongo/models/tag/Revision';
import { ObjectId, ObjectID } from 'mongodb';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import Tag from '../../mongo/models/tag/Tag';
import GQLError from '../../errors/GQLError';
import AppPlatformRevision from '../../mongo/models/tag/AppPlatformRevision';
import App from '../../mongo/models/tag/App';
import TYPES from '../../container/IOC.types';
import Trigger from '../../mongo/models/tag/Trigger';
import ActionGroupDistribution from '../../mongo/models/tag/ActionGroupDistribution';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { diff, revisionsJSONSafeDiff } from '../../utils/DiffUtils';
import { duplicateRevision, resolveRevision } from '../../utils/RevisionUtils';
import { RevisionIssue } from '../../mongo/types/Types';
import Model from '../../mongo/abstractions/Model';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import { dataMapsImplementPlatformDataMaps } from '../../utils/DataMapsUtils';
import DataMap from '../../mongo/models/tag/DataMap';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';
import { fetchEventRequests } from '../../utils/EventRequestsUtils';

@injectable()
export default class RevisionManager extends Manager<Revision> {
    @inject(TYPES.BackendDatabase) private backendDatabase!: BaseDatabase;

    protected gqlSchema = gql`
        """
        @type
        """
        type RevisionIssue {
            """
            Name of the model that is producting an issue
            """
            model: String!
            """
            The ID of the model producing the issue
            """
            modelId: String!
            """
            If available, the field associated with the model causing an issue
            """
            gqlField: String
            """
            A simple explaination of the issue itself
            """
            issue: String!
        }

        """
        @model
        A revision contains properties linked to an App. As these properties changes, we can track revisions and compare changes
        """
        type Revision {
            """
            Revision ID
            """
            id: ID!
            """
            App
            """
            app: App!
            """
            Revision Name
            """
            name: String!
            """
            Revision has been finalised and locked to prevent further changes
            """
            locked: Boolean!
            """
            Get all the tags linked to this revision
            """
            tags: [Tag!]!
            """
            Get all the global triggers linked to this revision
            """
            global_triggers: [Trigger!]!
            """
            Get all the global triggers linked to this revision
            """
            global_action_group_distributions: [ActionGroupDistribution!]!
            """
            Get all the \`AppPlatformRevision\`'s linked to this revision
            """
            app_platform_revisions: [AppPlatformRevision!]!
            """
            Revision Creation Time
            """
            created_at: DateTime!
            """
            Revision Last Update Time
            """
            updated_at: DateTime!
            """
            Event request stats - Please note that revision is automatically set in the filter options
            """
            event_request_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
        }
        input DuplicateRevisionInput {
            """
            ID of the revision to be duplicated
            """
            revision_id: ID!
            """
            Optionally provide a new name for the revision
            """
            new_name: String
        }
        input FinaliseRevisionInput {
            """
            ID of the revision to be finalised
            """
            revision_id: ID!
        }

        """
        Update a \`Revision\`'s properties
        """
        input RevisionUpdateInput {
            """
            \`Revision\` ID to update data against
            """
            revision_id: ID!
            """
            \`Revision\` name
            """
            name: String
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Revision
            Finds a Revision By Id
            """
            getRevision(id: ID!): Revision!
            """
            @bound=Revision
            Provides the left and right comparison of two revisions
            """
            revisionDifference(leftRevisionId: ID!, rightRevisionId: ID!): [RevisionDiff!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Revision
            Duplicate revision will clone any linked items and return a new revision
            """
            duplicateRevision(duplicateRevisionInput: DuplicateRevisionInput): Revision!
            """
            @bound=Revision
            To link a revision to an environment it must be 'locked', i.e in its final state
            """
            finaliseRevision(finaliseRevisionInput: FinaliseRevisionInput): [RevisionIssue!]!
            """
            @bound=Revision
            Update a \`Revision\`'s details.
            """
            updateRevision(revisionUpdateInput: RevisionUpdateInput): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Revision: {
            app: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectID(parent.app_id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    app.toGQLType(),
                );
            },
            app_platform_revisions: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                    (
                        await this.repoFactory(AppPlatformRevision).findByIds(
                            revision.appPlatformRevisionIds,
                        )
                    ).map((_) => _.toGQLType()),
                );
            },
            tags: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                    (await this.repoFactory(Tag).findByIds(revision.tagIds)).map((tag) =>
                        tag.toGQLType(),
                    ),
                );
            },
            global_triggers: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                    (await this.repoFactory(Trigger).findByIds(revision.globalTriggerIds)).map(
                        (_) => _.toGQLType(),
                    ),
                );
            },
            global_action_group_distributions: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                    (
                        await this.repoFactory(ActionGroupDistribution).findByIds(
                            revision.globalActionGroupDistributionIds,
                        )
                    ).map((_) => _.toGQLType()),
                );
            },
            event_request_stats: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.revisionFailed,
                );
                return fetchEventRequests('revision', revision, args, ctx);
            },
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getRevision: async (parent: any, args: any, ctx: CTX) => {
            const revision = await this.repoFactory(Revision).findByIdThrows(
                new ObjectID(args.id),
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                revision.toGQLType(),
            );
        },
        revisionDifference: async (parent: any, args: any, ctx: CTX) => {
            const left = await this.repoFactory(Revision).findByIdThrows(
                new ObjectID(args.leftRevisionId),
                userMessages.revisionFailed,
            );
            const right = await this.repoFactory(Revision).findByIdThrows(
                new ObjectID(args.rightRevisionId),
                userMessages.revisionFailed,
            );
            if (left.tagManagerAccountId.toString() !== right.tagManagerAccountId.toString()) {
                throw new GQLError(userMessages.incompatibleRevisions, true);
            }
            return this.orgAuth.asUserWithViewAccess(
                ctx,
                left.orgId,
                async () => await revisionsJSONSafeDiff(left, right),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.revisionUpdateInput;
            const revision = await this.repoFactory(Revision).findByIdThrows(
                new ObjectId(data.revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, revision.orgId, async (me) => {
                revision.bulkGQLSet(data, ['name']); //only is a safety check against this function
                await this.repoFactory(Revision).save(revision, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: data.comments,
                });
                return true;
            });
        },
        duplicateRevision: async (parent: any, args: any, ctx: CTX) => {
            const revision = await this.repoFactory(Revision).findById(
                new ObjectID(args.duplicateRevisionInput.revision_id),
            );
            if (revision === null) {
                throw new GQLError(userMessages.revisionFailed, true);
            } else {
                return this.orgAuth.asUserWithCreateAccess(ctx, revision.orgId, async (me) => {
                    const newRevision = await duplicateRevision(me, revision);
                    if (typeof args.duplicateRevisionInput.new_name === 'string') {
                        newRevision.name = args.duplicateRevisionInput.new_name;
                        return (
                            await this.repoFactory(Revision).save(
                                newRevision,
                                me,
                                OperationOwner.USER,
                                {
                                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                                    userComments: `Updated name of duplicate revision to ${newRevision.name}`,
                                },
                            )
                        ).toGQLType();
                    } else {
                        return newRevision.toGQLType();
                    }
                });
            }
        },
        finaliseRevision: async (parent: any, args: any, ctx: CTX) => {
            const implementsPlatformSettingsCorrectly = async (
                appPlatformRevision: AppPlatformRevision,
            ): Promise<string[]> => {
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    appPlatformRevision.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return dataMapsImplementPlatformDataMaps(
                    await this.repoFactory(DataMap).findByIds(
                        appPlatformRevision.platformSettingsDataMapIds,
                    ),
                    await this.repoFactory(PlatformDataMap).findByIds(
                        platformRevision.platformSettingsIds,
                    ),
                );
            };

            const checkRevision = async (
                revisionId: ObjectID | Revision,
            ): Promise<RevisionIssue[]> => {
                //first check are platforms merged correctly
                const revision = await resolveRevision(revisionId);

                const issueToRevisionIssue = (issue: string, model: Model): RevisionIssue => {
                    return {
                        model: model.constructor.name,
                        modelId: model.id.toString(),
                        issue: issue,
                    };
                };

                //from here down, the focus is on detecting issues with assigned platform revision
                const appPlatformRevisions = await this.repoFactory(AppPlatformRevision).find({
                    _revision_id: revision.id,
                });

                const platformSettingsIssues: RevisionIssue[] = (
                    await Promise.all(
                        appPlatformRevisions.map(
                            async (appPlatformRevision): Promise<RevisionIssue[] | null> => {
                                const issues = await implementsPlatformSettingsCorrectly(
                                    appPlatformRevision,
                                );
                                return issues.length > 0
                                    ? issues.map((issue) =>
                                          issueToRevisionIssue(issue, appPlatformRevision),
                                      )
                                    : null;
                            },
                        ),
                    )
                )
                    .filter((_): _ is RevisionIssue[] => _ !== null)
                    .flat();

                //we need to collect on every platform entity (use this to check against).
                const platformRevisions: PlatformRevision[] = await Promise.all(
                    appPlatformRevisions.map(
                        async (_) =>
                            await this.repoFactory(PlatformRevision).findByIdThrows(
                                _.platformRevisionId,
                                userMessages.revisionFailed,
                            ),
                    ),
                );
                const platformEntityIds: Set<string> = new Set(
                    (
                        await Promise.all(
                            platformRevisions.map(async (_) =>
                                (await diff(undefined, _)).map((d) => d.right!.id),
                            ),
                        )
                    )
                        .flat()
                        .map((_) => _.toString()),
                );
                const revisionPlatformEntityDeps: {
                    model: string;
                    modelId: string;
                    prop: string;
                    id: string;
                }[] = (await diff(undefined, revision))
                    .map((_) => {
                        return _.props.map((prop) => {
                            if (
                                prop.rightPlatformInstance !== null &&
                                _.right !== null &&
                                typeof prop.right === 'string'
                            ) {
                                return {
                                    model: _.right.constructor.name,
                                    modelId: _.right.id.toString(),
                                    prop: prop.gqlField,
                                    id: prop.right,
                                };
                            } else {
                                return null;
                            }
                        });
                    })
                    .flat()
                    .filter(
                        (_): _ is { model: string; modelId: string; prop: string; id: string } =>
                            _ !== null,
                    );
                const platformIssues = revisionPlatformEntityDeps
                    .map((_): RevisionIssue | null => {
                        if (platformEntityIds.has(_.id)) {
                            return null;
                        } else {
                            return {
                                model: _.model,
                                modelId: _.modelId,
                                gqlField: _.prop,
                                issue: `${_.model} property ${_.prop} does not correspond with any of the linked Platform Revisions`,
                            };
                        }
                    })
                    .filter((_): _ is RevisionIssue => _ !== null);
                return [...platformIssues, ...platformSettingsIssues];
            };

            const revision = await this.repoFactory(Revision).findByIdThrows(
                new ObjectID(args.finaliseRevisionInput.revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, revision.orgId, async (me) => {
                const issues = await checkRevision(revision);
                if (issues.length === 0) {
                    //we can finalise this...
                    revision.isFinal = true;
                    await this.repoFactory(Revision).save(revision, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.FINALIZE_REVISION,
                    });
                }
                return issues;
            });
        },
    };
}
