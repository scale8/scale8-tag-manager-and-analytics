import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import ActionGroup from '../../mongo/models/tag/ActionGroup';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import Action from '../../mongo/models/tag/Action';
import ActionGroupDistribution from '../../mongo/models/tag/ActionGroupDistribution';
import Revision from '../../mongo/models/tag/Revision';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import {
    createNewModelBranchFromModel,
    deleteModelCascading,
    getNewModelsOrder,
} from '../../utils/ModelUtils';
import User from '../../mongo/models/User';
import ActionGroupRepo from '../../mongo/repos/tag/ActionGroupRepo';

@injectable()
export default class ActionGroupManager extends Manager<ActionGroup> {
    protected gqlSchema = gql`
        """
        @model
        """
        type ActionGroup {
            """
            \`ActionGroup\` ID
            """
            id: ID!
            """
            \`ActionGroup\` name
            """
            name: String!
            """
            \`Action\`'s linked to this \`ActionGroup\`
            """
            actions: [Action!]!
            """
            Distribution value. -1 = Not distributed. Value is between -1 and 1000 inclusive.
            """
            distribution: Int!
            """
            If the distribution of this \`ActionGroup\` is locked
            """
            is_locked: Boolean!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=ActionGroup
            Get a \`ActionGroup\` model from the \`ActionGroup\` ID
            """
            getActionGroup(id: ID!): ActionGroup!
        }

        input ActionGroupCreateInput {
            """
            The \`ActionGroupDistribution\` under which the \`ActionGroup\` should be created
            """
            action_group_distribution_id: ID!
            """
            The name of the new \`ActionGroup\`
            """
            name: String!
            """
            The distribution value the new \`ActionGroup\`
            """
            distribution: Int = -1
            """
            If the distribution of the new \`ActionGroup\` should be locked
            """
            is_locked: Boolean = false
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionGroupDuplicateInput {
            """
            \`ActionGroup\` ID to clone against
            """
            action_group_id: ID!
            """
            New name for the \`ActionGroup\`
            """
            name: String!
        }

        input ActionGroupDeleteInput {
            """
            \`ActionGroup\` ID to delete against
            """
            action_group_id: ID!
            """
            If true, we can do a dry-run and check what the outcome of this delete will be before commiting to it
            """
            preview: Boolean = false
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionGroupUpdateInput {
            """
            \`ActionGroup\` ID to update against
            """
            action_group_id: ID!
            """
            \`ActionGroup\` name
            """
            name: String
            """
            The distribution value the \`ActionGroup\`
            """
            distribution: Int
            """
            If the distribution of the new \`ActionGroup\` should be locked
            """
            is_locked: Boolean
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionGroupOrderInput {
            """
            \`ActionGroup\` ID to order \`Action\`'s against
            """
            action_group_id: ID!
            """
            A new order of \`Action\` IDs
            """
            new_order: [ID!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=ActionGroup
            Create a new \`ActionGroup\`. \`ActionGroupDistribution\` ID is required here to ensure \`ActionGroup\` is placed inside the correct \`ActionGroupDistribution\`
            """
            createActionGroup(actionGroupCreateInput: ActionGroupCreateInput!): ActionGroup!
            """
            @bound=ActionGroup
            Duplicate an existing \`ActionGroup\`. The duplicated will copy everything beneath \`ActionGroup\`, creating a new \`ActionGroup\` entity and linking it to the same \`ActionGroupDistribution\`
            """
            duplicateActionGroup(
                actionGroupDuplicateInput: ActionGroupDuplicateInput!
            ): ActionGroup!
            """
            @bound=ActionGroup
            Update a \`ActionGroup\`'s details.
            """
            updateActionGroup(actionGroupUpdateInput: ActionGroupUpdateInput!): Boolean!
            """
            @bound=ActionGroup
            Update a set of \`ActionGroup\`'s details.
            """
            updateActionGroups(actionGroupUpdateInputs: [ActionGroupUpdateInput!]!): Boolean!
            """
            @bound=ActionGroup
            Delete a \`ActionGroup\` and its children.
            """
            deleteActionGroup(
                actionGroupDeleteInput: ActionGroupDeleteInput!
            ): [ModelDeleteAcknowledgement!]!
            """
            @bound=ActionGroup
            Update the order of \`Action\`'s curently linked to \`ActionGroup\`
            """
            updateActionsOrder(actionGroupOrderInput: ActionGroupOrderInput!): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getActionGroup: async (parent: any, args: any, ctx: CTX) => {
            const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                new ObjectID(args.id),
                userMessages.actionGroupFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, actionGroup.orgId, async () =>
                actionGroup.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateActionsOrder: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupOrderInput;
            const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                new ObjectId(data.action_group_id),
                userMessages.actionGroupFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, actionGroup.orgId, async (me) => {
                actionGroup.actionIds = getNewModelsOrder(actionGroup.actionIds, data.new_order);
                await this.repoFactory(ActionGroup).save(actionGroup, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.REORDER_LINKED_ENTITIES,
                    opConnectedModels: await this.repoFactory(Action).findByIds(
                        actionGroup.actionIds,
                    ),
                });
                return true;
            });
        },
        deleteActionGroup: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupDeleteInput;
            const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                new ObjectId(data.action_group_id),
                userMessages.actionGroupFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, actionGroup.orgId, async (me) => {
                const previewMode = data.preview === true;
                if (!previewMode) {
                    //we need to first unlink...
                    const actionGroupDistribution = await this.repoFactory(
                        ActionGroupDistribution,
                    ).findOneThrows(
                        {
                            _action_group_ids: actionGroup.id,
                        },
                        userMessages.actionGroupDistributionFailed,
                    );
                    actionGroupDistribution.actionGroupIds =
                        actionGroupDistribution.actionGroupIds.filter(
                            (_) => !_.equals(actionGroup.id),
                        );
                    await this.repoFactory(ActionGroupDistribution).save(
                        actionGroupDistribution,
                        me,
                        OperationOwner.USER,
                        {
                            gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                            userComments: data.comments,
                            opConnectedModels: [actionGroup],
                        },
                    );
                }
                return await deleteModelCascading(me, actionGroup, previewMode);
            });
        },
        updateActionGroup: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupUpdateInput;
            const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                new ObjectId(data.action_group_id),
                userMessages.actionGroupFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, actionGroup.orgId, async (me) => {
                actionGroup.bulkGQLSet(data, ['name', 'distribution', 'is_locked']); //only is a safety check against this function
                await this.repoFactory(ActionGroup).save(actionGroup, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: data.comments,
                });
                return true;
            });
        },
        updateActionGroups: async (parent: any, args: any, ctx: CTX) => {
            const result = (args.actionGroupUpdateInputs as any[]).map(
                async (input: any): Promise<boolean> => {
                    const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                        new ObjectId(input.action_group_id),
                        userMessages.actionGroupFailed,
                    );
                    return this.orgAuth.asUserWithEditAccess(ctx, actionGroup.orgId, async (me) => {
                        actionGroup.bulkGQLSet({ ...input }, ['name', 'distribution', 'is_locked']); //only is a safety check against this function
                        await this.repoFactory(ActionGroup).save(
                            actionGroup,
                            me,
                            OperationOwner.USER,
                            {
                                gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                                userComments: input.comments,
                            },
                        );
                        return true;
                    });
                },
            );
            return (await Promise.all(result)).every((_) => _);
        },
        duplicateActionGroup: async (parent: any, args: any, ctx: CTX) => {
            const duplicateActionGroup = async (
                actor: User,
                actionGroup: ActionGroup,
            ): Promise<ActionGroup> => {
                const actionGroupDistribution = await this.repoFactory(
                    ActionGroupDistribution,
                ).findOneThrows(
                    {
                        _action_group_ids: actionGroup.id,
                    },
                    userMessages.actionGroupDistributionFailed,
                );
                const newActionGroup = await createNewModelBranchFromModel(
                    actor,
                    actionGroup,
                    ActionGroupRepo,
                );
                actionGroupDistribution.actionGroupIds = [
                    ...actionGroupDistribution.actionGroupIds,
                    newActionGroup.id,
                ];
                await this.repoFactory(ActionGroupDistribution).save(
                    actionGroupDistribution,
                    actor,
                    OperationOwner.USER,
                    {
                        gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                        opConnectedModels: [newActionGroup],
                    },
                );
                return newActionGroup;
            };

            const data = args.actionGroupDuplicateInput;
            const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                new ObjectId(data.action_group_id),
                userMessages.actionGroupFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, actionGroup.orgId, async (me) => {
                const duplicate = await duplicateActionGroup(me, actionGroup);
                duplicate.name = data.name;
                return (
                    await this.repoFactory(ActionGroup).save(duplicate, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                        userComments: `Updated name to ${duplicate.name}`,
                    })
                ).toGQLType();
            });
        },
        createActionGroup: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupCreateInput;
            const actionGroupDistribution = await this.repoFactory(
                ActionGroupDistribution,
            ).findByIdThrows(
                new ObjectId(data.action_group_distribution_id),
                userMessages.actionGroupDistributionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(
                ctx,
                actionGroupDistribution.orgId,
                async (me) => {
                    //create a new entity...
                    const revision = await this.repoFactory(Revision).findByIdThrows(
                        actionGroupDistribution.revisionId,
                        userMessages.revisionFailed,
                    );
                    const newActionGroup = await this.repoFactory(ActionGroup).save(
                        new ActionGroup(data.name, revision, [], data.distribution, data.is_locked),
                        me,
                        OperationOwner.USER,
                        {
                            gqlMethod: GQLMethod.CREATE,
                            userComments: data.comments,
                        },
                    );
                    //link this back to the parent entity...
                    actionGroupDistribution.actionGroupIds = [
                        ...actionGroupDistribution.actionGroupIds,
                        newActionGroup.id,
                    ];
                    await this.repoFactory(ActionGroupDistribution).save(
                        actionGroupDistribution,
                        me,
                        OperationOwner.USER,
                        {
                            gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                            opConnectedModels: [newActionGroup],
                        },
                    );
                    //finally return the new entity
                    return newActionGroup.toGQLType();
                },
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        ActionGroup: {
            actions: async (parent: any, args: any, ctx: CTX) => {
                const actionGroup = await this.repoFactory(ActionGroup).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.actionGroupFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, actionGroup.orgId, async () =>
                    (await this.repoFactory(Action).findByIds(actionGroup.actionIds)).map((_) =>
                        _.toGQLType(),
                    ),
                );
            },
        },
    };
}
