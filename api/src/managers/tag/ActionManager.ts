import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import Action from '../../mongo/models/tag/Action';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import PlatformAction from '../../mongo/models/tag/PlatformAction';
import DataMap from '../../mongo/models/tag/DataMap';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import Revision from '../../mongo/models/tag/Revision';
import ActionGroup from '../../mongo/models/tag/ActionGroup';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import { DataMapSchema, DataMapSchemaCheck } from '../../mongo/types/Types';
import GQLError from '../../errors/GQLError';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { deleteModelCascading } from '../../utils/ModelUtils';
import {
    createDataMapSchemasFromDataMapInput,
    createDataMapsFromSchemas,
    dataMapSchemasImplementsPlatformDataMaps,
} from '../../utils/DataMapsUtils';
import User from '../../mongo/models/User';
import container from '../../container/IOC.config';
import RepoFromModelFactory from '../../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../../container/IOC.types';
import Dependency from '../../mongo/models/Dependency';
import RevisionRepo from '../../mongo/repos/tag/RevisionRepo';

@injectable()
export default class ActionManager extends Manager<Action> {
    protected gqlSchema = gql`
        """
        @model
        """
        type Action {
            """
            \`Action\` ID
            """
            id: ID!
            """
            \`Action\` name
            """
            name: String!
            """
            \`PlatformAction\` that this \`Action\` implements
            """
            platform_action: PlatformAction!
            """
            \`DataMap\`'s that implements the \`PlatformDataMap\` of the connected \`PlatformAction\`
            """
            data_maps: [DataMap!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Action
            Get a \`Action\` model from the \`Action\` ID
            """
            getAction(id: ID!): Action!
        }

        input ActionCreateInput {
            """
            The \`ActionGroup\` under which the \`Action\` should be created
            """
            action_group_id: ID!
            """
            The new \`Action\`'s name
            """
            name: String!
            """
            The \`PlatformAction\` ID being implemented
            """
            platform_action_id: ID!
            """
            An array of \`DataMapInput\` that will create corresponding \`DataMap\`'s and implement the \`PlatformDataMap\` of the connected \`PlatformAction\`
            """
            data_maps: [DataMapInput!]!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionUpdateInput {
            """
            \`Action\` ID to update against
            """
            action_id: ID!
            """
            The \`Action\`'s name
            """
            name: String
            """
            An array of \`DataMapInput\` that will create corresponding \`DataMap\`'s and implement the \`PlatformDataMap\` of the connected \`PlatformAction\`
            """
            data_maps: [DataMapInput!]
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionDeleteInput {
            """
            \`Action\` ID to delete against
            """
            action_id: ID!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Action
            Create a new \`Action\`.
            """
            createAction(actionCreateInput: ActionCreateInput!): Action!
            """
            @bound=Action
            Update an \`Action\`.
            """
            updateAction(actionUpdateInput: ActionUpdateInput!): Boolean!
            """
            @bound=Action
            Delete an \`Action\` and its children.
            """
            deleteAction(actionDeleteInput: ActionDeleteInput!): [ModelDeleteAcknowledgement!]!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getAction: async (parent: any, args: any, ctx: CTX) => {
            const action = await this.repoFactory(Action).findByIdThrows(
                new ObjectId(args.id),
                userMessages.actionFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, action.orgId, async () =>
                action.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateAction: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionUpdateInput;
            const action = await this.repoFactory(Action).findByIdThrows(
                new ObjectId(data.action_id),
                userMessages.actionFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, action.orgId, async (me) => {
                action.bulkGQLSet(data, ['name']);
                if (data.data_maps !== undefined) {
                    const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                        action.platformActionId,
                        userMessages.actionFailed,
                    );
                    const dataMapSchemas: DataMapSchema[] = createDataMapSchemasFromDataMapInput(
                        data.data_maps,
                    );
                    const checks: DataMapSchemaCheck[] =
                        await dataMapSchemasImplementsPlatformDataMaps(
                            await this.repoFactory(PlatformDataMap).findByIds(
                                platformAction.platformDataMapIds,
                            ),
                            dataMapSchemas,
                        );
                    const revision = await this.repoFactory(Revision).findByIdThrows(
                        action.revisionId,
                        userMessages.revisionFailed,
                    );
                    if (checks.every((_) => _.valid)) {
                        const oldDataMaps = await this.repoFactory(DataMap).findByIds(
                            action.dataMapIds,
                        );
                        const newDataMaps = await createDataMapsFromSchemas(
                            me,
                            dataMapSchemas,
                            revision,
                        );
                        action.dataMapIds = newDataMaps.map((_) => _.id);
                        await this.repoFactory(Action).save(action, me, OperationOwner.USER, {
                            gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                            userComments: data.comments,
                        });
                        //remove old data maps...
                        await Promise.all(oldDataMaps.map((_) => deleteModelCascading(me, _)));
                        //remove old deps
                        await this.removeAllDeps(me, action);
                        //register new deps
                        await this.registerAllDeps(me, action, checks);
                    } else {
                        throw new GQLError(userMessages.cantValidatePlatformAction, true);
                    }
                } else {
                    await this.repoFactory(Action).save(action, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                        userComments: data.comments,
                    });
                }
                return true;
            });
        },
        deleteAction: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionDeleteInput;
            const action = await this.repoFactory(Action).findByIdThrows(
                new ObjectId(data.action_id),
                userMessages.actionFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, action.orgId, async (me) => {
                const actionGroup = await this.repoFactory(ActionGroup).findOneThrows(
                    {
                        _action_ids: action.id,
                    },
                    userMessages.actionGroupFailed,
                );
                actionGroup.actionIds = actionGroup.actionIds.filter((_) => !_.equals(action.id));
                await this.repoFactory(ActionGroup).save(actionGroup, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                    userComments: data.comments,
                    opConnectedModels: [action],
                });
                //remove any deps...
                await this.removeAllDeps(me, action);
                //finally delete action...
                return await deleteModelCascading(me, action);
            });
        },
        createAction: async (parent: any, args: any, ctx: CTX) => {
            const getValidPlatformActions = async (
                revision: Revision,
            ): Promise<PlatformAction[]> => {
                return await this.repoFactory(PlatformAction).findByIds(
                    (
                        await this.repoFactory<RevisionRepo>(Revision).getValidPlatformRevisions(
                            revision,
                        )
                    )
                        .map((_) => _.platformActionIds)
                        .flat(),
                );
            };

            const data = args.actionCreateInput;
            const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                new ObjectId(data.action_group_id),
                userMessages.actionGroupFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, actionGroup.orgId, async (me) => {
                //create a new entity...
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    actionGroup.revisionId,
                    userMessages.revisionFailed,
                );
                const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                    new ObjectId(data.platform_action_id),
                    userMessages.actionFailed,
                );
                if (
                    (await getValidPlatformActions(revision)).find((_) =>
                        _.id.equals(platformAction.id),
                    ) === undefined
                ) {
                    throw new GQLError(userMessages.invalidPlatformAction, true);
                }

                const dataMapSchemas: DataMapSchema[] = createDataMapSchemasFromDataMapInput(
                    data.data_maps,
                );
                const checks: DataMapSchemaCheck[] = await dataMapSchemasImplementsPlatformDataMaps(
                    await this.repoFactory(PlatformDataMap).findByIds(
                        platformAction.platformDataMapIds,
                    ),
                    dataMapSchemas,
                );
                if (checks.every((_) => _.valid)) {
                    const dataMaps = await createDataMapsFromSchemas(me, dataMapSchemas, revision);
                    const newAction = await this.repoFactory(Action).save(
                        new Action(data.name, revision, platformAction, dataMaps),
                        me,
                        OperationOwner.USER,
                        {
                            gqlMethod: GQLMethod.CREATE,
                            userComments: data.comments,
                        },
                    );
                    //link this back to the parent entity...
                    actionGroup.actionIds = [...actionGroup.actionIds, newAction.id];
                    await this.repoFactory(ActionGroup).save(actionGroup, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                        opConnectedModels: [newAction],
                    });
                    //register any deps...
                    await this.registerAllDeps(me, newAction, checks);
                    //finally return the new entity
                    return newAction.toGQLType();
                } else {
                    throw new GQLError(userMessages.cantValidatePlatformAction, true);
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
        Action: {
            platform_action: async (parent: any, args: any, ctx: CTX) => {
                const action = await this.repoFactory(Action).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.actionFailed,
                );
                const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                    action.platformActionId,
                    userMessages.actionFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformAction.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () => platformAction.toGQLType(),
                );
            },
            data_maps: async (parent: any, args: any, ctx: CTX) => {
                const action = await this.repoFactory(Action).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.actionFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, action.orgId, async () =>
                    (await this.repoFactory(DataMap).findByIds(action.dataMapIds)).map((_) =>
                        _.toGQLType(),
                    ),
                );
            },
        },
    };

    private async registerAllDeps(actor: User, action: Action, checks: DataMapSchemaCheck[]) {
        if (await this.config.trackDependencies()) {
            const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
            await Promise.all(
                checks
                    .map((_) =>
                        _.model_links?.map(
                            async (modelLink) =>
                                await repoFactory(Dependency).save(
                                    new Dependency(
                                        action.id,
                                        action.constructor.name,
                                        modelLink.id,
                                        modelLink.name,
                                    ),
                                    actor,
                                ),
                        ),
                    )
                    .filter((_): _ is Promise<Dependency>[] => _ !== undefined)
                    .flat(),
            );
        }
    }

    private async removeAllDeps(actor: User, action: Action) {
        const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
        const deps = await repoFactory(Dependency).find({
            _model_id: action.id,
            _model_name: action.constructor.name,
        });
        await Promise.all(deps.map((_) => repoFactory(Dependency).delete(_, actor)));
    }
}
