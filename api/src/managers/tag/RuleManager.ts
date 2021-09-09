import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import Rule from '../../mongo/models/tag/Rule';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import ActionGroupDistribution from '../../mongo/models/tag/ActionGroupDistribution';
import RuleGroup from '../../mongo/models/tag/RuleGroup';
import Revision from '../../mongo/models/tag/Revision';
import Trigger from '../../mongo/models/tag/Trigger';
import GQLError from '../../errors/GQLError';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import {
    createNewModelBranchFromModel,
    deleteModelCascading,
    getNewModelsOrder,
} from '../../utils/ModelUtils';
import User from '../../mongo/models/User';
import RuleRepo from '../../mongo/repos/tag/RuleRepo';
import ActionGroupDistributionRepo from '../../mongo/repos/tag/ActionGroupDistributionRepo';
import { RevisionEntityParentType } from '../../enums/RevisionEntityParentType';

@injectable()
export default class RuleManager extends Manager<Rule> {
    protected gqlSchema = gql`
        """
        @model
        A \`Rule\` links a trigger and action group distributions together.
        """
        type Rule {
            """
            The ID of the \`Rule\`
            """
            id: ID!
            """
            The name of the \`Rule\`
            """
            name: String!
            """
            A \`Trigger\` attached to the \`Rule\`.
            """
            trigger: Trigger!
            """
            All set of \`ActionGroupDistribution\`'s attached to this \`Rule\` and will be triggered once \`Event\` and \`ConditionRule\`'s are considered
            """
            action_groups_distributions: [ActionGroupDistribution!]!
            """
            If the \`Rule\` is currently active or inactive
            """
            is_active: Boolean!
            """
            The minimum refresh interval. -1 = the rule can't repeat. 0 = the rule can repeat. > 0 the rule must wait this many milliseconds before being allowed to repeat again.
            """
            min_repeat_interval: Int!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Rule
            Get a \`Rule\` model from the \`Rule\` ID
            """
            getRule(id: ID!): Rule!
        }

        input RuleCreateInput {
            """
            The \`RuleGroup\` under which the \`Rule\` should be created
            """
            rule_group_id: ID!
            """
            If provided, this rule will be bound to the \`Trigger\` id from \`Revision\` globals. It can't be changed to a custom trigger once set.
            """
            global_trigger_id: ID
            """
            The name of the new \`Rule\`
            """
            name: String!
            """
            The minimum refresh interval. -1 = the rule can't repeat. 0 = the rule can repeat. > 0 the rule must wait this many milliseconds before being allowed to repeat again.
            """
            min_repeat_interval: Int = -1
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input RuleDuplicateInput {
            """
            \`Rule\` ID to clone against
            """
            rule_id: ID!
            """
            New name for the \`Rule\`
            """
            name: String!
        }

        input RuleDeleteInput {
            """
            \`Rule\` ID to delete against
            """
            rule_id: ID!
            """
            If true, we can do a dry-run and check what the outcome of this delete will be before commiting to it
            """
            preview: Boolean = false
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input RuleUpdateInput {
            """
            \`Rule\` ID to update against
            """
            rule_id: ID!
            """
            \`Rule\` name
            """
            name: String
            """
            If the \`Rule\` should be active or not
            """
            is_active: Boolean
            """
            The minimum refresh interval. -1 = the rule can't repeat. 0 = the rule can repeat. > 0 the rule must wait this many milliseconds before being allowed to repeat again.
            """
            min_repeat_interval: Int
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input RuleOrderInput {
            """
            \`Rule\` ID to order rules against
            """
            rule_id: ID!
            """
            A new order of \`Rule\` IDs
            """
            new_order: [ID!]!
        }

        input GlobalActionGroupDistributionLinkInput {
            """
            \`Rule\` ID
            """
            rule_id: ID!
            """
            Global \`ActionGroupDistribution\` ID
            """
            global_action_group_distribution_id: ID!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input GlobalActionGroupDistributionUnlinkInput {
            """
            \`Rule\` ID
            """
            rule_id: ID!
            """
            Global \`ActionGroupDistribution\` ID
            """
            global_action_group_distribution_id: ID!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Rule
            Create a new \`Rule\`. \`RuleGroup\` ID is required here to ensure \`Rule\` is placed inside the correct version
            """
            createRule(ruleCreateInput: RuleCreateInput!): Rule!
            """
            @bound=Rule
            Duplicate a new \`Rule\`. The duplicated will copy everything beneath \`Rule\`, creating a new \`Rule\` entity and linking it to the same \`RuleGroup\`
            """
            duplicateRule(ruleDuplicateInput: RuleDuplicateInput!): Rule!
            """
            @bound=Rule
            Update a \`Rule\`'s details.
            """
            updateRule(ruleUpdateInput: RuleUpdateInput!): Boolean!
            """
            @bound=Rule
            Delete a \`Rule\` and its children.
            """
            deleteRule(ruleDeleteInput: RuleDeleteInput!): [ModelDeleteAcknowledgement!]!
            """
            @bound=Rule
            Update the order of \`ActionDistribution\`'s curently linked to \`Rule\`
            """
            updateActionDistributionsOrder(ruleOrderInput: RuleOrderInput!): Boolean!
            """
            @bound=Rule
            Link a global \`ActionGroupDistribution\`'s to a \`Rule\`
            """
            linkGlobalActionGroupDistribution(
                globalActionGroupDistributionLinkInput: GlobalActionGroupDistributionLinkInput!
            ): Boolean!
            """
            @bound=Rule
            Link a global \`ActionGroupDistribution\`'s to a \`Rule\`
            """
            unlinkGlobalActionGroupDistribution(
                globalActionGroupDistributionUnlinkInput: GlobalActionGroupDistributionUnlinkInput!
            ): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getRule: async (parent: any, args: any, ctx: CTX) => {
            const rule = await this.repoFactory(Rule).findByIdThrows(
                new ObjectID(args.id),
                userMessages.ruleFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, rule.orgId, async () =>
                rule.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        linkGlobalActionGroupDistribution: async (parent: any, args: any, ctx: CTX) => {
            const data = args.globalActionGroupDistributionLinkInput;
            const rule = await this.repoFactory(Rule).findByIdThrows(
                new ObjectId(data.rule_id),
                userMessages.ruleFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, rule.orgId, async (me) => {
                const actionGroupDistribution = await this.repoFactory(
                    ActionGroupDistribution,
                ).findByIdThrows(
                    new ObjectId(data.global_action_group_distribution_id),
                    userMessages.actionGroupDistributionFailed,
                );
                if (rule.revisionId.equals(actionGroupDistribution.revisionId)) {
                    //they both belong to same revision...
                    rule.setActionGroupDistributions([
                        ...(await this.repoFactory<ActionGroupDistributionRepo>(
                            ActionGroupDistribution,
                        ).getAllFromRule(rule)),
                        actionGroupDistribution,
                    ]);
                    await this.repoFactory(Rule).save(rule, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                        userComments: data.comments,
                        opConnectedModels: [actionGroupDistribution],
                    });
                    return true;
                } else {
                    throw new GQLError(userMessages.ruleGABNotSameRevision, true);
                }
            });
        },
        unlinkGlobalActionGroupDistribution: async (parent: any, args: any, ctx: CTX) => {
            const data = args.globalActionGroupDistributionUnlinkInput;
            const rule = await this.repoFactory(Rule).findByIdThrows(
                new ObjectId(data.rule_id),
                userMessages.ruleFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, rule.orgId, async (me) => {
                const removeId = new ObjectId(data.global_action_group_distribution_id);
                rule.setActionGroupDistributions([
                    ...(
                        await this.repoFactory<ActionGroupDistributionRepo>(
                            ActionGroupDistribution,
                        ).getAllFromRule(rule)
                    ).filter((_) => !_.id.equals(removeId)),
                ]);
                await this.repoFactory(Rule).save(rule, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                    userComments: data.comments,
                    opConnectedModels: [
                        await this.repoFactory(ActionGroupDistribution).findByIdThrows(
                            removeId,
                            userMessages.actionGroupDistributionFailed,
                        ),
                    ],
                });
                return true;
            });
        },
        updateActionDistributionsOrder: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleOrderInput;
            const rule = await this.repoFactory(Rule).findByIdThrows(
                new ObjectId(data.rule_id),
                userMessages.ruleFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, rule.orgId, async (me) => {
                const actionGroupDistributionIds = getNewModelsOrder(
                    (
                        await this.repoFactory<ActionGroupDistributionRepo>(
                            ActionGroupDistribution,
                        ).getAllFromRule(rule)
                    ).map((_) => _.id),
                    data.new_order,
                );
                const actionGroupDistributions = await this.repoFactory(
                    ActionGroupDistribution,
                ).findByIds(actionGroupDistributionIds);
                //extra filter here to check ownership
                const validated = actionGroupDistributions.filter((_) =>
                    rule.revisionId.equals(_.revisionId),
                );
                rule.setActionGroupDistributions(validated);
                await this.repoFactory(Rule).save(rule, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.REORDER_LINKED_ENTITIES,
                    opConnectedModels: validated,
                });
                return true;
            });
        },
        deleteRule: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleDeleteInput;
            const rule = await this.repoFactory(Rule).findByIdThrows(
                new ObjectId(data.rule_id),
                userMessages.ruleFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, rule.orgId, async (me) => {
                const previewMode = data.preview === true;
                if (!previewMode) {
                    //we need to first unlink...
                    const ruleGroup = await this.repoFactory(RuleGroup).findOneThrows(
                        {
                            _rule_ids: rule.id,
                        },
                        userMessages.ruleGroupFailed,
                    );
                    ruleGroup.ruleIds = ruleGroup.ruleIds.filter((_) => !_.equals(rule.id));
                    await this.repoFactory(RuleGroup).save(ruleGroup, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                        userComments: data.comments,
                        opConnectedModels: [rule],
                    });
                }
                return await deleteModelCascading(me, rule, previewMode);
            });
        },
        updateRule: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleUpdateInput;
            const rule = await this.repoFactory(Rule).findByIdThrows(
                new ObjectId(data.rule_id),
                userMessages.ruleFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, rule.orgId, async (me) => {
                rule.bulkGQLSet(data, ['name', 'is_active', 'min_repeat_interval']); //only is a safety check against this function
                await this.repoFactory(Rule).save(rule, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: data.comments,
                });
                return true;
            });
        },
        duplicateRule: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleDuplicateInput;
            const rule = await this.repoFactory(Rule).findByIdThrows(
                new ObjectId(data.rule_id),
                userMessages.ruleFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, rule.orgId, async (me) => {
                const duplicateRule = async (actor: User, rule: Rule): Promise<Rule> => {
                    //find the rule group that contains this rule...
                    const ruleGroup = await this.repoFactory(RuleGroup).findOneThrows(
                        {
                            _rule_ids: rule.id,
                        },
                        userMessages.ruleGroupFailed,
                    );
                    const newRule = await createNewModelBranchFromModel(actor, rule, RuleRepo);
                    ruleGroup.ruleIds = [...ruleGroup.ruleIds, newRule.id];
                    await this.repoFactory(RuleGroup).save(ruleGroup, actor, OperationOwner.USER, {
                        gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                        opConnectedModels: [newRule],
                    });
                    return newRule;
                };

                const duplicate = await duplicateRule(me, rule);
                duplicate.name = data.name;
                return (
                    await this.repoFactory(Rule).save(duplicate, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                        userComments: `Changed rule name to ${duplicate.name}`,
                    })
                ).toGQLType();
            });
        },
        createRule: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ruleCreateInput;
            const ruleGroup = await this.repoFactory(RuleGroup).findByIdThrows(
                new ObjectId(data.rule_group_id),
                userMessages.ruleGroupFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, ruleGroup.orgId, async (me) => {
                //create a new entity...
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    ruleGroup.revisionId,
                    userMessages.revisionFailed,
                );

                const getTrigger: () => Promise<Trigger> = async () => {
                    if (data.global_trigger_id) {
                        const trigger = await this.repoFactory(Trigger).findByIdThrows(
                            new ObjectId(data.global_trigger_id),
                            userMessages.triggerFailed,
                        );
                        if (
                            trigger.parentType === 'REVISION' &&
                            revision.id.equals(trigger.revisionId)
                        ) {
                            return trigger;
                        } else {
                            throw new GQLError(userMessages.triggerFailed, true);
                        }
                    } else {
                        return await this.repoFactory(Trigger).save(
                            new Trigger('Custom Trigger', RevisionEntityParentType.RULE, revision),
                            me,
                        );
                    }
                };

                const newRule = await this.repoFactory(Rule).save(
                    new Rule(data.name, revision, await getTrigger(), [], data.min_repeat_interval),
                    me,
                    OperationOwner.USER,
                    {
                        gqlMethod: GQLMethod.CREATE,
                        userComments: data.comments,
                    },
                );
                //link this back to the parent entity...
                ruleGroup.ruleIds = [...ruleGroup.ruleIds, newRule.id];
                await this.repoFactory(RuleGroup).save(ruleGroup, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                    opConnectedModels: [newRule],
                });
                //finally return the new entity
                return newRule.toGQLType();
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Rule: {
            trigger: async (parent: any, args: any, ctx: CTX) => {
                const rule = await this.repoFactory(Rule).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.ruleFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, rule.orgId, async () => {
                    if (typeof rule.triggerId === 'string') {
                        //search by persisting id...
                        return (
                            await this.repoFactory(Trigger).findOneThrows(
                                {
                                    _revision_id: rule.revisionId,
                                    ___persisting_id: rule.triggerId,
                                },
                                userMessages.triggerFailed,
                            )
                        ).toGQLType();
                    } else {
                        return (
                            await this.repoFactory(Trigger).findByIdThrows(
                                rule.triggerId,
                                userMessages.triggerFailed,
                            )
                        ).toGQLType();
                    }
                });
            },
            action_groups_distributions: async (parent: any, args: any, ctx: CTX) => {
                const rule = await this.repoFactory(Rule).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.ruleFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, rule.orgId, async () =>
                    (
                        await this.repoFactory<ActionGroupDistributionRepo>(
                            ActionGroupDistribution,
                        ).getAllFromRule(rule)
                    ).map((_) => _.toGQLType()),
                );
            },
        },
    };
}
