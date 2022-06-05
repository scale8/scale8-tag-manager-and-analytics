import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import RuleGroup from '../../mongo/models/tag/RuleGroup';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import Rule from '../../mongo/models/tag/Rule';
import Tag from '../../mongo/models/tag/Tag';
import GQLError from '../../errors/GQLError';
import Revision from '../../mongo/models/tag/Revision';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { createNewModelBranchFromModel, deleteModelCascading } from '../../utils/ModelUtils';
import User from '../../mongo/models/User';
import RuleGroupRepo from '../../mongo/repos/tag/RuleGroupRepo';

@injectable()
export default class RuleGroupManager extends Manager<RuleGroup> {
    protected gqlSchema = gql`
        """
        @model
        A \`RuleGroup\` provides a way to group a number of rules together. This is useful for both encapsulation of specific behaviours and also provides the ability to clone and disable in bulk.
        """
        type RuleGroup {
            """
            The \`RuleGroup\` ID
            """
            id: ID!
            """
            Name associated with the \`RuleGroup\`
            """
            name: String!
            """
            If the \`RuleGroup\` is active or inactive
            """
            is_active: Boolean!
            """
            A set of rules attached to the \`RuleGroup\`.
            """
            rules: [Rule!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=RuleGroup
            Get a \`RuleGroup\` model from the \`RuleGroup\` ID
            """
            getRuleGroup(id: ID!): RuleGroup!
        }

        input RuleGroupCreateInput {
            """
            The \`Tag\` under which the \`RuleGroup\` should be created
            """
            tag_id: ID!
            """
            The name of the new \`RuleGroup\`
            """
            name: String!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input RuleGroupDuplicateInput {
            """
            \`RuleGroup\` ID to clone against
            """
            rule_group_id: ID!
            """
            New name for the \`RuleGroup\`
            """
            name: String!
        }

        input RuleGroupDeleteInput {
            """
            \`RuleGroup\` ID to delete against
            """
            rule_group_id: ID!
            """
            If true, we can do a dry-run and check what the outcome of this delete will be before commiting to it
            """
            preview: Boolean = false
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input RuleGroupUpdateInput {
            """
            \`RuleGroup\` ID to update against
            """
            rule_group_id: ID!
            """
            \`RuleGroup\` name
            """
            name: String
            """
            If the \`RuleGroup\` should be active or not
            """
            is_active: Boolean
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input RuleGroupRuleOrderInput {
            """
            \`RuleGroup\` ID to order rules against
            """
            rule_group_id: ID!
            """
            A new order of \`Rule\` IDs
            """
            new_order: [ID!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=RuleGroup
            Create a new \`RuleGroup\`. \`Tag\` ID is required here to ensure \`RuleGroup\` is placed inside the correct version
            """
            createRuleGroup(ruleGroupCreateInput: RuleGroupCreateInput!): RuleGroup!
            """
            @bound=RuleGroup
            Duplicate a new \`RuleGroup\`. The duplicated will copy everything beneath \`RuleGroup\`, creating a new \`RuleGroup\` entity and linking it to the same \`Tag\`
            """
            duplicateRuleGroup(ruleGroupDuplicateInput: RuleGroupDuplicateInput!): RuleGroup!
            """
            @bound=RuleGroup
            Update a \`RuleGroup\`'s details.
            """
            updateRuleGroup(ruleGroupUpdateInput: RuleGroupUpdateInput!): Boolean!
            """
            @bound=RuleGroup
            Delete a \`RuleGroup\` and its children.
            """
            deleteRuleGroup(
                ruleGroupDeleteInput: RuleGroupDeleteInput!
            ): [ModelDeleteAcknowledgement!]!
            """
            @bound=RuleGroup
            Update the order of \`Rule\`'s curently linked to \`RuleGroup\`
            """
            updateRulesOrder(ruleGroupRuleOrderInput: RuleGroupRuleOrderInput!): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateRulesOrder: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleGroupRuleOrderInput;
            const ruleGroup = await this.repoFactory(RuleGroup).findByIdThrows(
                new ObjectId(data.rule_group_id),
                userMessages.ruleGroupFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, ruleGroup.orgId, async (me) => {
                //we need to cycle through existing set
                if (
                    ruleGroup.ruleIds.length === data.new_order.length &&
                    ruleGroup.ruleIds
                        .map((_) => _.toString())
                        .every((_) => data.new_order.indexOf(_) !== -1)
                ) {
                    //the length is the same and every item has been accounted for...
                    ruleGroup.ruleIds = (data.new_order as string[]).map((_) => new ObjectId(_));
                    await this.repoFactory(RuleGroup).save(ruleGroup, me, {
                        gqlMethod: GQLMethod.REORDER_LINKED_ENTITIES,
                        opConnectedModels: await this.repoFactory(Rule).findByIds(
                            ruleGroup.ruleIds,
                        ),
                    });
                    return true;
                } else {
                    throw new GQLError(userMessages.reOrderProblem, true);
                }
            });
        },
        deleteRuleGroup: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleGroupDeleteInput;
            const ruleGroup = await this.repoFactory(RuleGroup).findByIdThrows(
                new ObjectId(data.rule_group_id),
                userMessages.ruleGroupFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, ruleGroup.orgId, async (me) => {
                const previewMode = data.preview === true;
                if (!previewMode) {
                    //we need to first unlink...
                    const tag = await this.repoFactory(Tag).findOneThrows(
                        {
                            _rule_group_ids: ruleGroup.id,
                        },
                        userMessages.tagFailed,
                    );
                    tag.ruleGroupIds = tag.ruleGroupIds.filter((_) => !_.equals(ruleGroup.id));
                    await this.repoFactory(Tag).save(tag, me, {
                        gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                        userComments: data.comments,
                        opConnectedModels: [ruleGroup],
                    });
                }
                return await deleteModelCascading(me, ruleGroup, previewMode);
            });
        },
        updateRuleGroup: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleGroupUpdateInput;
            const ruleGroup = await this.repoFactory(RuleGroup).findByIdThrows(
                new ObjectId(data.rule_group_id),
                userMessages.ruleGroupFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, ruleGroup.orgId, async (me) => {
                ruleGroup.bulkGQLSet(data, ['name', 'is_active']); //only is a safety check against this function
                await this.repoFactory(RuleGroup).save(ruleGroup, me, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: data.comments,
                });
                return true;
            });
        },
        duplicateRuleGroup: async (parent: any, args: any, ctx: CTX) => {
            const duplicateRuleGroup = async (
                actor: User,
                ruleGroup: RuleGroup,
            ): Promise<RuleGroup> => {
                //find the tag that contains the rule group...
                const tag = await this.repoFactory(Tag).findOneThrows(
                    {
                        _rule_group_ids: ruleGroup.id,
                    },
                    userMessages.tagFailed,
                );
                const newRuleGroup = await createNewModelBranchFromModel(
                    actor,
                    ruleGroup,
                    RuleGroupRepo,
                );
                tag.ruleGroupIds = [...tag.ruleGroupIds, newRuleGroup.id];
                await this.repoFactory(Tag).save(tag, actor, {
                    gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                    opConnectedModels: [newRuleGroup],
                });
                return newRuleGroup;
            };

            const data = args.ruleGroupDuplicateInput;
            const ruleGroup = await this.repoFactory(RuleGroup).findByIdThrows(
                new ObjectId(data.rule_group_id),
                userMessages.ruleGroupFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, ruleGroup.orgId, async (me) => {
                const duplicate = await duplicateRuleGroup(me, ruleGroup);
                duplicate.name = data.name;
                return (
                    await this.repoFactory(RuleGroup).save(duplicate, me, {
                        gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                        userComments: `Changed rule group name to ${duplicate.name}`,
                    })
                ).toGQLType();
            });
        },
        createRuleGroup: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleGroupCreateInput;
            const tag = await this.repoFactory(Tag).findByIdThrows(
                new ObjectId(data.tag_id),
                userMessages.tagFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, tag.orgId, async (me) => {
                //create a new tag...
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    tag.revisionId,
                    userMessages.revisionFailed,
                );
                const newRuleGroup = await this.repoFactory(RuleGroup).save(
                    new RuleGroup(data.name, revision),
                    me,
                    {
                        gqlMethod: GQLMethod.CREATE,
                        userComments: data.comments,
                    },
                );
                //link this back to the parent entity...
                tag.ruleGroupIds = [...tag.ruleGroupIds, newRuleGroup.id];
                await this.repoFactory(Tag).save(tag, me, {
                    gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                    opConnectedModels: [newRuleGroup],
                });
                //finally return the new entity
                return newRuleGroup.toGQLType();
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getRuleGroup: async (parent: any, args: any, ctx: CTX) => {
            const ruleGroup = await this.repoFactory(RuleGroup).findByIdThrows(
                new ObjectId(args.id),
                userMessages.ruleGroupFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, ruleGroup.orgId, async () =>
                ruleGroup.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        RuleGroup: {
            rules: async (parent: any, args: any, ctx: CTX) => {
                const ruleGroup = await this.repoFactory(RuleGroup).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.ruleGroupFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, ruleGroup.orgId, async () =>
                    (await this.repoFactory(Rule).findByIds(ruleGroup.ruleIds)).map((_) =>
                        _.toGQLType(),
                    ),
                );
            },
        },
    };
}
