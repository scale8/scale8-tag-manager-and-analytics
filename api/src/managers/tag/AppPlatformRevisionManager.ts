import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import AppPlatformRevision from '../../mongo/models/tag/AppPlatformRevision';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import DataMap from '../../mongo/models/tag/DataMap';
import Revision from '../../mongo/models/tag/Revision';
import GQLError from '../../errors/GQLError';
import Platform from '../../mongo/models/tag/Platform';
import DiffState from '../../enums/DiffState';
import PlatformAction from '../../mongo/models/tag/PlatformAction';
import PlatformDataContainer from '../../mongo/models/tag/PlatformDataContainer';
import PlatformEvent from '../../mongo/models/tag/PlatformEvent';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { diff } from '../../utils/DiffUtils';
import { deleteModelCascading } from '../../utils/ModelUtils';
import {
    createDataMapSchemasFromDataMapInput,
    createDataMapsFromSchemas,
} from '../../utils/DataMapsUtils';
import User from '../../mongo/models/User';
import Action from '../../mongo/models/tag/Action';
import ActionGroup from '../../mongo/models/tag/ActionGroup';
import Event from '../../mongo/models/tag/Event';
import Trigger from '../../mongo/models/tag/Trigger';
import ConditionRule from '../../mongo/models/tag/ConditionRule';

@injectable()
export default class AppPlatformRevisionManager extends Manager<AppPlatformRevision> {
    protected readonly DIRECT_INTEGRATIONS = [
        PlatformAction.name,
        PlatformEvent.name,
        PlatformDataContainer.name,
    ];

    protected gqlSchema = gql`
        """
        @model
        The \`AppPlatformRevision\` model holds the relationship between \`Revision\` and \`PlatformRevision\` with respect to the \`App\`. A \`Revision\` is therefore tied to one or more \`PlatformRevision\`s although only one \`PlatformRevision\` per \`Platform\`
        """
        type AppPlatformRevision {
            """
            \`AppPlatformRevision\` ID
            """
            id: ID!
            """
            \`PlatformRevision\` that is currently linked to this \`AppPlatformRevision\`
            """
            platform_revision: PlatformRevision!
            """
            \`DataMap\` that implements platform settings and currently attached to this \`AppPlatformRevision\`
            """
            platform_settings: [DataMap!]!
            """
            The date the \`AppPlatformRevision\` was created at
            """
            created_at: DateTime!
            """
            The date the \`AppPlatformRevision\` was last updated at
            """
            updated_at: DateTime!
        }

        """
        @type
        """
        type PlatformRevisionMergeIssue {
            """
            Name of the model
            """
            name: String!
            """
            Type of model
            """
            entity: String!
            """
            ID of the model
            """
            id: ID!
        }

        """
        Parameters required to link a \`PlatformRevision\` with a \`Revision\`. The 'data_maps' provided are used to implement the \`Platform\` settings of the \`Platform\`.
        """
        input AppPlatformRevisionLinkInput {
            """
            \`Revision\` ID
            """
            revision_id: ID!
            """
            \`PlatformRevision\` ID
            """
            platform_revision_id: ID!
            """
            An array of \`DataMapInput\`s that will create corresponding \`DataMap\`s that implement the \`PlatformDataMap\` described by platform settings on \`Platform\`
            """
            data_maps: [DataMapInput!]!
            """
            Preview the outcome before commiting
            """
            preview: Boolean = false
        }

        input AppPlatformRevisionUnlinkInput {
            """
            \`AppPlatformRevision\` ID to delete against
            """
            app_platform_revision_id: ID!
            """
            Preview the outcome before commiting
            """
            preview: Boolean = false
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=AppPlatformRevision
            Link an app and platform together via their corresponding revisions.
            """
            linkPlatformRevision(
                appPlatformRevisionLinkInput: AppPlatformRevisionLinkInput!
            ): [PlatformRevisionMergeIssue!]!
            """
            @bound=AppPlatformRevision
            Delete an \`AppPlatformRevision\` and its children.
            """
            unlinkPlatformRevision(
                appPlatformRevisionUnlinkInput: AppPlatformRevisionUnlinkInput!
            ): [PlatformRevisionMergeIssue!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=AppPlatformRevision
            Get an \`AppPlatformRevision\` model from \`AppPlatformRevision\` ID
            """
            getAppPlatformRevision(id: ID!): AppPlatformRevision!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getAppPlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const appPlatformRevision = await this.repoFactory(AppPlatformRevision).findByIdThrows(
                new ObjectId(args.id),
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(
                ctx,
                appPlatformRevision.orgId,
                async () => appPlatformRevision.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        unlinkPlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.appPlatformRevisionUnlinkInput;
            const appPlatformRevision = await this.repoFactory(AppPlatformRevision).findByIdThrows(
                new ObjectId(data.app_platform_revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(
                ctx,
                appPlatformRevision.orgId,
                async (me) => {
                    const revision = await this.repoFactory(Revision).findByIdThrows(
                        appPlatformRevision.revisionId,
                        userMessages.revisionFailed,
                    );
                    const preview = data.preview;
                    if (revision.isFinal) {
                        throw new GQLError(
                            userMessages.revisionLockedLinkingPlatformRevision,
                            true,
                        );
                    }
                    const platformRevision = await this.repoFactory(
                        PlatformRevision,
                    ).findByIdThrows(
                        appPlatformRevision.platformRevisionId,
                        userMessages.revisionFailed,
                    );
                    const platform = await this.repoFactory(Platform).findByIdThrows(
                        platformRevision.platformId,
                        userMessages.platformFailed,
                    );
                    if (platform.isCore) {
                        throw new GQLError(userMessages.cantLinkCore, true);
                    } else {
                        //if we are unlinking, we just have to focus on deleting all linked entities... (no merging etc)
                        const platformRevisionDiff = await diff(platformRevision, undefined);

                        const removeEntities = platformRevisionDiff
                            .filter((_) => {
                                return (
                                    this.DIRECT_INTEGRATIONS.indexOf(_.model) > -1 &&
                                    _.left !== null
                                );
                            })
                            .map((_) => {
                                return {
                                    model: _.model,
                                    id: _.left!.id,
                                };
                            });

                        const getIssues = async (): Promise<
                            { name: string; entity: string; id: string }[]
                        > =>
                            removeEntities.length > 0
                                ? this.removeLinkedRevisionEntities(
                                      removeEntities.map((_) => {
                                          return { model: _.model, id: _.id };
                                      }),
                                      revision,
                                      preview,
                                      me,
                                  )
                                : [];

                        const issues = await getIssues();

                        if (preview) {
                            return issues;
                        } else {
                            revision.appPlatformRevisionIds =
                                revision.appPlatformRevisionIds.filter(
                                    (_) => !_.equals(appPlatformRevision.id),
                                );
                            await this.repoFactory(Revision).save(revision, me);
                            await deleteModelCascading(me, appPlatformRevision);
                            return issues;
                        }
                    }
                },
            );
        },
        linkPlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.appPlatformRevisionLinkInput;
            const revision = await this.repoFactory(Revision).findByIdThrows(
                new ObjectId(data.revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, revision.orgId, async (me) => {
                const preview = data.preview;

                if (revision.isFinal) {
                    throw new GQLError(userMessages.revisionLockedLinkingPlatformRevision, true);
                }
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    new ObjectId(data.platform_revision_id),
                    userMessages.revisionFailed,
                );
                //platform revision must be published in order to link it
                if (!platformRevision.isPublished) {
                    throw new GQLError(userMessages.platformNotPublished, true);
                }

                const createNewAppPlatformRevision = async (): Promise<AppPlatformRevision> => {
                    const dataMapSchemas = createDataMapSchemasFromDataMapInput(data.data_maps);
                    const dataMaps = await createDataMapsFromSchemas(me, dataMapSchemas, revision);
                    //create a new entity...
                    return await this.repoFactory(AppPlatformRevision).save(
                        new AppPlatformRevision(revision, platformRevision, dataMaps),
                        me,
                    );
                };

                const linkedAppPlatformRevision = await this.repoFactory(
                    AppPlatformRevision,
                ).findOne({
                    _revision_id: revision.id,
                    _platform_id: platformRevision.platformId,
                });
                if (linkedAppPlatformRevision === null) {
                    //there is nothing to do here, nothing previously linked, we can just link the new one up...
                    if (preview) {
                        return []; //no issues
                    }
                    //create a new entity...
                    const newAppPlatformRevision = await createNewAppPlatformRevision();
                    revision.appPlatformRevisionIds = [
                        ...revision.appPlatformRevisionIds,
                        newAppPlatformRevision.id,
                    ];
                    await this.repoFactory(Revision).save(revision, me);
                    //finally return any empty array (no issues)
                    return [];
                } else {
                    //there is something already linked, so we have a bit of work to do.
                    const linkedPlatformRevision = await this.repoFactory(
                        PlatformRevision,
                    ).findByIdThrows(
                        linkedAppPlatformRevision.platformRevisionId,
                        userMessages.revisionFailed,
                    );
                    const platformRevisionDiff = await diff(
                        linkedPlatformRevision,
                        platformRevision,
                    );

                    const removeEntities = platformRevisionDiff
                        .filter((_) => {
                            return (
                                this.DIRECT_INTEGRATIONS.indexOf(_.model) > -1 &&
                                (_.state === DiffState.MODIFIED ||
                                    _.state === DiffState.DELETED ||
                                    _.childrenModified) &&
                                _.left !== null
                            );
                        })
                        .map((_) => {
                            return {
                                model: _.model,
                                id: _.left!.id,
                                state: _.state,
                            };
                        });

                    const getIssues = async (): Promise<
                        { name: string; entity: string; id: string }[]
                    > =>
                        removeEntities.length > 0
                            ? this.removeLinkedRevisionEntities(
                                  removeEntities.map((_) => {
                                      return { model: _.model, id: _.id };
                                  }),
                                  revision,
                                  preview,
                                  me,
                              )
                            : [];

                    const issues = await getIssues();

                    if (preview) {
                        return issues;
                    } else {
                        //continue with auto merging the rest...
                        const autoMergeIdMap: Map<string, string> = new Map(
                            platformRevisionDiff
                                .filter((_) => _.state === DiffState.NONE)
                                .map((_) => [_.left!.id.toString(), _.right!.id.toString()]),
                        );
                        await Promise.all(
                            (
                                await diff(undefined, revision)
                            )
                                .filter((modelDiff) =>
                                    modelDiff.props.some((_) => _.rightPlatformInstance !== null),
                                )
                                .map((_) => {
                                    return _.props.map(async (prop) => {
                                        if (
                                            prop.rightPlatformInstance !== null &&
                                            _.right !== null &&
                                            typeof prop.right === 'string'
                                        ) {
                                            //this is a linked platform instance, lets see if we can auto-merge it...
                                            const newValue = autoMergeIdMap.get(prop.right);
                                            if (newValue !== undefined) {
                                                const repo = this.repoFactory(
                                                    _.right.constructor.name,
                                                );
                                                const model = await repo.findByIdThrows(
                                                    _.right.id,
                                                    userMessages.diffFailed,
                                                );
                                                (model as any)[prop.field] = new ObjectId(newValue);
                                                await repo.save(model, me, {
                                                    gqlMethod: GQLMethod.AUTO_MERGE,
                                                });
                                            }
                                        }
                                    });
                                })
                                .flat(),
                        );
                        //create a new entity...
                        const newAppPlatformRevision = await createNewAppPlatformRevision();
                        revision.appPlatformRevisionIds = [
                            ...revision.appPlatformRevisionIds.filter(
                                (id) => !linkedAppPlatformRevision.id.equals(id),
                            ),
                            newAppPlatformRevision.id,
                        ];
                        await this.repoFactory(Revision).save(revision, me);
                        //remove the old one...
                        await deleteModelCascading(me, linkedAppPlatformRevision);
                        //finally return any issues found...
                        return issues;
                    }
                }
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        AppPlatformRevision: {
            platform_revision: async (parent: any, args: any, ctx: CTX) => {
                const appPlatformRevision = await this.repoFactory(
                    AppPlatformRevision,
                ).findByIdThrows(new ObjectId(parent.id), userMessages.revisionFailed);
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    appPlatformRevision.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () => platformRevision.toGQLType(),
                );
            },
            platform_settings: async (parent: any, args: any, ctx: CTX) => {
                const appPlatformRevision = await this.repoFactory(
                    AppPlatformRevision,
                ).findByIdThrows(new ObjectId(parent.id), userMessages.revisionFailed);
                return this.orgAuth.asUserWithViewAccess(ctx, appPlatformRevision.orgId, async () =>
                    (
                        await this.repoFactory(DataMap).findByIds(
                            appPlatformRevision.platformSettingsDataMapIds,
                        )
                    ).map((_) => _.toGQLType()),
                );
            },
        },
    };

    private async removeLinkedRevisionEntities(
        linked: { model: string; id: ObjectId }[],
        revision: Revision,
        preview: boolean,
        actor: User,
    ): Promise<{ name: string; entity: string; id: string }[]> {
        return (
            await Promise.all(
                linked.map(async (_) => {
                    if (_.model === PlatformAction.name) {
                        const actions = await this.repoFactory(Action).find({
                            _revision_id: revision.id,
                            _platform_action_id: new ObjectId(_.id),
                        });
                        if (!preview) {
                            const actionIds = actions.map((action) => action.id);
                            const actionGroups = await this.repoFactory(ActionGroup).find({
                                _action_ids: { $in: actionIds },
                            });
                            await Promise.all(
                                actionGroups.map((actionGroup) => {
                                    actionGroup.actionIds = actionGroup.actionIds.filter(
                                        (linkedActionId) =>
                                            actionIds.find((actionId) =>
                                                linkedActionId.equals(actionId),
                                            ) === undefined,
                                    );
                                    return this.repoFactory(ActionGroup).save(actionGroup, actor);
                                }),
                            );
                            await Promise.all(
                                actions.map((action) => deleteModelCascading(actor, action)),
                            );
                        }
                        return actions.map((action) => {
                            return {
                                entity: action.constructor.name,
                                name: action.name,
                                id: action.id.toString(),
                            };
                        });
                    } else if (_.model === PlatformEvent.name) {
                        const events = await this.repoFactory(Event).find({
                            _revision_id: revision.id,
                            _event: new ObjectId(_.id),
                        });
                        if (!preview) {
                            const eventIds = events.map((event) => event.id);
                            const triggers = await this.repoFactory(Trigger).find({
                                _event_ids: { $in: eventIds },
                            });
                            await Promise.all(
                                triggers.map((trigger) => {
                                    trigger.eventIds = trigger.eventIds.filter(
                                        (linkedEventId) =>
                                            eventIds.find((eventId) =>
                                                linkedEventId.equals(eventId),
                                            ) === undefined,
                                    );
                                    return this.repoFactory(Trigger).save(trigger, actor);
                                }),
                            );
                            await Promise.all(
                                events.map((event) => deleteModelCascading(actor, event)),
                            );
                        }
                        return events.map((event) => {
                            return {
                                entity: event.constructor.name,
                                name: event.name,
                                id: event.id.toString(),
                            };
                        });
                    } else if (_.model === PlatformDataContainer.name) {
                        const conditionRules = await this.repoFactory(ConditionRule).find({
                            _revision_id: revision.id,
                            _platform_data_container_id: new ObjectId(_.id),
                        });
                        if (!preview) {
                            const conditionRuleIds = conditionRules.map(
                                (conditionRule) => conditionRule.id,
                            );
                            const triggers = await this.repoFactory(Trigger).find({
                                $or: [
                                    { _condition_rule_ids: { $in: conditionRuleIds } },
                                    { _exception_rule_ids: { $in: conditionRuleIds } },
                                ],
                            });
                            await Promise.all(
                                triggers.map((trigger) => {
                                    trigger.conditionRuleIds = trigger.conditionRuleIds.filter(
                                        (linkedId) =>
                                            conditionRuleIds.find((conditionRuleId) =>
                                                linkedId.equals(conditionRuleId),
                                            ) === undefined,
                                    );
                                    trigger.exceptionRuleIds = trigger.exceptionRuleIds.filter(
                                        (linkedId) =>
                                            conditionRuleIds.find((conditionRuleId) =>
                                                linkedId.equals(conditionRuleId),
                                            ) === undefined,
                                    );
                                    return this.repoFactory(Trigger).save(trigger, actor);
                                }),
                            );
                            await Promise.all(
                                conditionRules.map((conditionRule) =>
                                    deleteModelCascading(actor, conditionRule),
                                ),
                            );
                        }
                        return conditionRules.map((conditionRule) => {
                            return {
                                entity: conditionRule.constructor.name,
                                name: conditionRule.name,
                                id: conditionRule.id.toString(),
                            };
                        });
                    } else {
                        throw new GQLError(userMessages.forceRemoveEntity(_.model), true);
                    }
                }),
            )
        ).flat();
    }
}
