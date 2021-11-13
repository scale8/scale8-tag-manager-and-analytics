import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import ActionGroup from '../../mongo/models/tag/ActionGroup';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import ActionGroupDistribution from '../../mongo/models/tag/ActionGroupDistribution';
import Rule from '../../mongo/models/tag/Rule';
import Revision from '../../mongo/models/tag/Revision';
import GQLError from '../../errors/GQLError';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import {
    createNewModelBranchFromModel,
    deleteModelCascading,
    getNewModelsOrder,
} from '../../utils/ModelUtils';
import {
    createActionGroupDistribution,
    linkAndReturnActionGroupDistribution,
} from '../../utils/ActionGroupDistributionUtils';
import User from '../../mongo/models/User';
import ActionGroupDistributionRepo from '../../mongo/repos/tag/ActionGroupDistributionRepo';
import { unLinkFromRevision } from '../../utils/RevisionUtils';

@injectable()
export default class ActionGroupDistributionManager extends Manager<ActionGroupDistribution> {
    protected gqlSchema = gql`
        """
        @model
        """
        type ActionGroupDistribution {
            """
            \`ActionGroupDistribution\` ID
            """
            id: ID!
            """
            \`ActionGroupDistribution\` name
            """
            name: String!
            """
            Revision
            """
            revision: Revision!
            """
            Type of entity this model is bound to
            """
            parent_type: RevisionEntityParentType!
            """
            \`ActionGroupDistribution\` distribution type (see \`ActionGroupDistributionType\`)
            """
            action_group_distribution_type: ActionGroupDistributionType!
            """
            \`ActionGroup\`'s associated with this \`ActionGroupDistribution\`
            """
            action_groups: [ActionGroup!]!
            """
            Date the action group distribution was created
            """
            created_at: DateTime!
            """
            Date the action group distribution was last updated
            """
            updated_at: DateTime!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=ActionGroupDistribution
            Get a \`ActionGroupDistribution\` model from the \`ActionGroupDistribution\` ID
            """
            getActionGroupDistribution(id: ID!): ActionGroupDistribution!
        }

        """
        Only one attachment point should be provided for the action group distribution. Either a rule_id or a revision_id, not both.
        """
        input ActionGroupDistributionCreateInput {
            """
            The \`Rule\` under which the \`ActionGroupDistribution\` should be created
            """
            rule_id: ID
            """
            The \`Revision\` under which the \`ActionGroupDistribution\` should be created
            """
            revision_id: ID
            """
            The name of the new \`ActionGroupDistribution\`
            """
            name: String!
            """
            The distribution type of the new \`ActionGroupDistribution\`
            """
            action_group_distribution_type: ActionGroupDistributionType!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionGroupDistributionDuplicateInput {
            """
            \`ActionGroupDistribution\` ID to clone against
            """
            action_group_distribution_id: ID!
            """
            New name for the \`ActionGroupDistribution\`
            """
            name: String!
        }

        input ActionGroupDistributionDeleteInput {
            """
            \`ActionGroupDistribution\` ID to delete against
            """
            action_group_distribution_id: ID!
            """
            If true, we can do a dry-run and check what the outcome of this delete will be before commiting to it
            """
            preview: Boolean = false
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionGroupDistributionUpdateInput {
            """
            \`ActionGroupDistribution\` ID to update against
            """
            action_group_distribution_id: ID!
            """
            \`ActionGroupDistribution\` name
            """
            name: String
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ActionGroupDistributionOrderInput {
            """
            \`ActionGroupDistribution\` ID to order rules against
            """
            action_group_distribution_id: ID!
            """
            A new order of \`Rule\` IDs
            """
            new_order: [ID!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=ActionGroupDistribution
            Create a new \`ActionGroupDistribution\`. \`Rule\` ID is required here to ensure \`ActionGroupDistribution\` is placed inside the correct version
            """
            createActionGroupDistribution(
                actionGroupDistributionCreateInput: ActionGroupDistributionCreateInput!
            ): ActionGroupDistribution!
            """
            @bound=ActionGroupDistribution
            Duplicate an existing \`ActionGroupDistribution\`. The duplicated will copy everything beneath \`ActionGroupDistribution\`, creating a new \`ActionGroupDistribution\` entity and linking it to the same \`Rule\`
            """
            duplicateActionGroupDistribution(
                actionGroupDistributionDuplicateInput: ActionGroupDistributionDuplicateInput!
            ): ActionGroupDistribution!
            """
            @bound=ActionGroupDistribution
            Update a \`ActionGroupDistribution\`'s details.
            """
            updateActionGroupDistribution(
                actionGroupDistributionUpdateInput: ActionGroupDistributionUpdateInput!
            ): Boolean!
            """
            @bound=ActionGroupDistribution
            Delete a \`ActionGroupDistribution\` and its children.
            """
            deleteActionGroupDistribution(
                actionGroupDistributionDeleteInput: ActionGroupDistributionDeleteInput!
            ): [ModelDeleteAcknowledgement!]!
            """
            @bound=ActionGroupDistribution
            Update the order of \`ActionGroup\`'s curently linked to \`ActionGroupDistribution\`
            """
            updateActionGroupsOrder(
                actionGroupDistributionOrderInput: ActionGroupDistributionOrderInput!
            ): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getActionGroupDistribution: async (parent: any, args: any, ctx: CTX) => {
            const actionGroupDistribution = await this.repoFactory(
                ActionGroupDistribution,
            ).findByIdThrows(new ObjectId(args.id), userMessages.actionGroupDistributionFailed);
            return await this.orgAuth.asUserWithViewAccess(
                ctx,
                actionGroupDistribution.orgId,
                async () => actionGroupDistribution.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateActionGroupsOrder: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupDistributionOrderInput;
            const actionGroupDistribution = await this.repoFactory(
                ActionGroupDistribution,
            ).findByIdThrows(
                new ObjectId(data.action_group_distribution_id),
                userMessages.actionGroupDistributionFailed,
            );
            return this.orgAuth.asUserWithEditAccess(
                ctx,
                actionGroupDistribution.orgId,
                async (me) => {
                    actionGroupDistribution.actionGroupIds = getNewModelsOrder(
                        actionGroupDistribution.actionGroupIds,
                        data.new_order,
                    );
                    await this.repoFactory(ActionGroupDistribution).save(
                        actionGroupDistribution,
                        me,
                        OperationOwner.USER,
                        {
                            gqlMethod: GQLMethod.REORDER_LINKED_ENTITIES,
                            opConnectedModels: await this.repoFactory(ActionGroup).findByIds(
                                actionGroupDistribution.actionGroupIds,
                            ),
                        },
                    );
                    return true;
                },
            );
        },
        deleteActionGroupDistribution: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupDistributionDeleteInput;
            const actionGroupDistribution = await this.repoFactory(
                ActionGroupDistribution,
            ).findByIdThrows(
                new ObjectId(data.action_group_distribution_id),
                userMessages.actionGroupDistributionFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(
                ctx,
                actionGroupDistribution.orgId,
                async (me) => {
                    const previewMode = data.preview === true;
                    if (actionGroupDistribution.parentType === 'REVISION') {
                        //we can only delete this if it not linked to any rules...
                        const rule = await this.repoFactory(Rule).findOne({
                            '_global_action_group_distribution_ids.__arr':
                                actionGroupDistribution._persisting_id,
                            _revision_id: actionGroupDistribution.revisionId,
                        });
                        if (rule === null) {
                            //we can now delete this...
                            if (!previewMode) {
                                await unLinkFromRevision(
                                    actionGroupDistribution,
                                    me,
                                    data.comments,
                                );
                            }
                            return await deleteModelCascading(
                                me,
                                actionGroupDistribution,
                                previewMode,
                            );
                        } else {
                            throw new GQLError(
                                userMessages.gadStillAttached(rule.id.toString()),
                                true,
                            );
                        }
                    } else {
                        if (!previewMode) {
                            //we need to first unlink...
                            const rule = await this.repoFactory(Rule).findOneThrows(
                                {
                                    _custom_action_group_distribution_ids:
                                        actionGroupDistribution.id,
                                },
                                userMessages.ruleFailed,
                            );
                            const currentActionGroupDistributions =
                                await this.repoFactory<ActionGroupDistributionRepo>(
                                    ActionGroupDistribution,
                                ).getAllFromRule(rule);
                            rule.setActionGroupDistributions(
                                currentActionGroupDistributions.filter(
                                    (_) => !_.id.equals(actionGroupDistribution.id),
                                ),
                            );
                            await this.repoFactory(Rule).save(rule, me, OperationOwner.USER, {
                                gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                                userComments: data.comments,
                                opConnectedModels: [actionGroupDistribution],
                            });
                        }
                        return await deleteModelCascading(me, actionGroupDistribution, previewMode);
                    }
                },
            );
        },
        updateActionGroupDistribution: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupDistributionUpdateInput;
            const actionGroupDistribution = await this.repoFactory(
                ActionGroupDistribution,
            ).findByIdThrows(
                new ObjectId(data.action_group_distribution_id),
                userMessages.actionGroupDistributionFailed,
            );
            return this.orgAuth.asUserWithEditAccess(
                ctx,
                actionGroupDistribution.orgId,
                async (me) => {
                    actionGroupDistribution.bulkGQLSet(data, ['name']); //only is a safety check against this function
                    await this.repoFactory(ActionGroupDistribution).save(
                        actionGroupDistribution,
                        me,
                        OperationOwner.USER,
                        {
                            gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                            userComments: data.comments,
                        },
                    );
                    return true;
                },
            );
        },
        duplicateActionGroupDistribution: async (parent: any, args: any, ctx: CTX) => {
            const duplicateActionGroupDistribution = async (
                actor: User,
                actionGroupDistribution: ActionGroupDistribution,
            ): Promise<ActionGroupDistribution> => {
                // need to find the Rule - _action_group_distribution_ids
                const getParentEntity: () => Promise<Rule | Revision> = async () => {
                    return actionGroupDistribution.parentType === 'RULE'
                        ? this.repoFactory(Rule).findOneThrows(
                              {
                                  _custom_action_group_distribution_ids: actionGroupDistribution.id,
                              },
                              userMessages.ruleFailed,
                          )
                        : this.repoFactory(Revision).findByIdThrows(
                              actionGroupDistribution.revisionId,
                              userMessages.revisionFailed,
                          );
                };
                const parentEntity: Rule | Revision = await getParentEntity();
                const newActionGroupDistribution = await createNewModelBranchFromModel(
                    actor,
                    actionGroupDistribution,
                    ActionGroupDistributionRepo,
                );
                return await linkAndReturnActionGroupDistribution(
                    parentEntity,
                    newActionGroupDistribution,
                    actor,
                );
            };

            const data = args.actionGroupDistributionDuplicateInput;
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
                    const duplicate = await duplicateActionGroupDistribution(
                        me,
                        actionGroupDistribution,
                    );
                    duplicate.name = data.name;
                    return (
                        await this.repoFactory(ActionGroupDistribution).save(
                            duplicate,
                            me,
                            OperationOwner.USER,
                            {
                                gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                                userComments: `Updated name to ${duplicate.name}`,
                            },
                        )
                    ).toGQLType();
                },
            );
        },
        createActionGroupDistribution: async (parent: any, args: any, ctx: CTX) => {
            const data = args.actionGroupDistributionCreateInput;
            const getParentEntity: () => Promise<Rule | Revision> = async () => {
                return data.rule_id !== undefined
                    ? this.repoFactory(Rule).findByIdThrows(
                          new ObjectId(data.rule_id),
                          userMessages.ruleFailed,
                      )
                    : this.repoFactory(Revision).findByIdThrows(
                          new ObjectId(data.revision_id),
                          userMessages.revisionFailed,
                      );
            };
            const parentEntity: Rule | Revision = await getParentEntity();
            return this.orgAuth.asUserWithCreateAccess(ctx, parentEntity.orgId, async (me) =>
                (
                    await createActionGroupDistribution(
                        me,
                        parentEntity,
                        data.name,
                        data.action_group_distribution_type,
                        data.comments,
                    )
                ).toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        ActionGroupDistribution: {
            revision: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    new ObjectId(parent.revision_id),
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                    revision.toGQLType(),
                );
            },
            action_groups: async (parent: any, args: any, ctx: CTX) => {
                const actionGroupDistribution = await this.repoFactory(
                    ActionGroupDistribution,
                ).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.actionGroupDistributionFailed,
                );
                return this.orgAuth.asUserWithViewAccess(
                    ctx,
                    actionGroupDistribution.orgId,
                    async () =>
                        (
                            await this.repoFactory(ActionGroup).findByIds(
                                actionGroupDistribution.actionGroupIds,
                            )
                        ).map((_) => _.toGQLType()),
                );
            },
        },
    };
}
