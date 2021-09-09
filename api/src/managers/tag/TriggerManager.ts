import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import Event from '../../mongo/models/tag/Event';
import ConditionRule from '../../mongo/models/tag/ConditionRule';
import Revision from '../../mongo/models/tag/Revision';
import Trigger from '../../mongo/models/tag/Trigger';
import GQLError from '../../errors/GQLError';
import Rule from '../../mongo/models/tag/Rule';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import {
    createNewModelBranchFromModel,
    deleteModelCascading,
    getNewModelsOrder,
} from '../../utils/ModelUtils';
import { createGlobalTrigger } from '../../utils/TriggerUtils';
import User from '../../mongo/models/User';
import TriggerRepo from '../../mongo/repos/tag/TriggerRepo';
import { unLinkFromRevision } from '../../utils/RevisionUtils';

@injectable()
export default class TriggerManager extends Manager<Trigger> {
    protected gqlSchema = gql`
        """
        @model
        A \`Trigger\` describes a set of events that must all be fired for a \`Trigger\` to complete. It also specifies an optional list of both conditions and exceptions (\`ConditionRule\`) that too must all be satisfied in order for the \`Trigger\` to be fired.
        """
        type Trigger {
            """
            The ID of the \`Trigger\`
            """
            id: ID!
            """
            The name of the \`Trigger\`
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
            A list of events that must be satisfied in order for a \`Trigger\` to be triggered.
            """
            events: [Event!]!
            """
            A series of \`ConditionRule\`'s that must all happen before any actions can be performed from this \`Trigger\`
            """
            condition_rules: [ConditionRule!]!
            """
            Exceptions describe an optional set of \`ConditionRule\`'s that will preclude a \`Trigger\` from being triggered
            """
            exception_rules: [ConditionRule!]!
            """
            Date the trigger was created
            """
            created_at: DateTime!
            """
            Date the trigger was last updated
            """
            updated_at: DateTime!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Trigger
            Get a \`Trigger\` model from the \`Trigger\` ID
            """
            getTrigger(id: ID!): Trigger!
        }

        """
        A \`Trigger\` can only be created on a \`Revision\`. A \`Rule\` has an immutable, persistant \`Trigger\` associated with it.
        """
        input TriggerCreateInput {
            """
            The \`Rule\` under which the \`Trigger\` should be created
            """
            revision_id: ID!
            """
            The name of the new \`Rule\`
            """
            name: String!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input TriggerDuplicateInput {
            """
            \`Trigger\` ID to clone against
            """
            trigger_id: ID!
            """
            New name for the \`Trigger\`
            """
            name: String!
        }

        input TriggerDeleteInput {
            """
            \`Trigger\` ID to delete against
            """
            trigger_id: ID!
            """
            If true, we can do a dry-run and check what the outcome of this delete will be before commiting to it
            """
            preview: Boolean = false
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input TriggerUpdateInput {
            """
            \`Trigger\` ID to update against
            """
            trigger_id: ID!
            """
            \`Trigger\` name
            """
            name: String
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input TriggerOrderInput {
            """
            \`Trigger\` ID to order rules against
            """
            trigger_id: ID!
            """
            A new order of entity IDs
            """
            new_order: [ID!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Trigger
            Create a new \`Trigger\`
            """
            createTrigger(triggerCreateInput: TriggerCreateInput!): Trigger!
            """
            @bound=Trigger
            Duplicate a \`Trigger\`. The duplicated will copy everything beneath \`Trigger\`, creating a new \`Trigger\` entity and linking it back to the same parent entity.
            """
            duplicateTrigger(triggerDuplicateInput: TriggerDuplicateInput!): Trigger!
            """
            @bound=Trigger
            Update a \`Trigger\`'s details.
            """
            updateTrigger(triggerUpdateInput: TriggerUpdateInput!): Boolean!
            """
            @bound=Trigger
            Delete a \`Trigger\` and its children.
            """
            deleteTrigger(triggerDeleteInput: TriggerDeleteInput!): [ModelDeleteAcknowledgement!]!
            """
            @bound=Trigger
            Update the order of \`Event\`'s curently linked to \`Trigger\`
            """
            updateEventsOrder(triggerOrderInput: TriggerOrderInput!): Boolean!
            """
            @bound=Trigger
            Update the order of \`Condition\`'s curently linked to \`Trigger\`
            """
            updateConditionsOrder(triggerOrderInput: TriggerOrderInput!): Boolean!
            """
            @bound=Trigger
            Update the order of \`Exception\`'s curently linked to \`Trigger\`
            """
            updateExceptionsOrder(triggerOrderInput: TriggerOrderInput!): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getTrigger: async (parent: any, args: any, ctx: CTX) => {
            const trigger = await this.repoFactory(Trigger).findByIdThrows(
                new ObjectID(args.id),
                userMessages.triggerFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, trigger.orgId, async () =>
                trigger.toGQLType(),
            );
        },
    };

    private async conditionRuleUpdateOrder(
        ruleIdsField: 'exceptionRuleIds' | 'conditionRuleIds',
        data: { trigger_id: string; new_order: string[] },
        ctx: CTX,
    ) {
        const trigger = await this.repoFactory(Trigger).findByIdThrows(
            new ObjectId(data.trigger_id),
            userMessages.triggerFailed,
        );
        return this.orgAuth.asUserWithEditAccess(ctx, trigger.orgId, async (me) => {
            trigger[ruleIdsField] = getNewModelsOrder(trigger[ruleIdsField], data.new_order);
            await this.repoFactory(Trigger).save(trigger, me, OperationOwner.USER, {
                gqlMethod: GQLMethod.REORDER_LINKED_ENTITIES,
                opConnectedModels: await this.repoFactory(ConditionRule).findByIds(
                    trigger.exceptionRuleIds,
                ),
            });
            return true;
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateExceptionsOrder: async (parent: any, args: any, ctx: CTX) => {
            return this.conditionRuleUpdateOrder('exceptionRuleIds', args.triggerOrderInput, ctx);
        },
        updateConditionsOrder: async (parent: any, args: any, ctx: CTX) => {
            return this.conditionRuleUpdateOrder('conditionRuleIds', args.triggerOrderInput, ctx);
        },
        updateEventsOrder: async (parent: any, args: any, ctx: CTX) => {
            const data = args.triggerOrderInput;
            const trigger = await this.repoFactory(Trigger).findByIdThrows(
                new ObjectId(data.trigger_id),
                userMessages.triggerFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, trigger.orgId, async (me) => {
                trigger.eventIds = getNewModelsOrder(trigger.eventIds, data.new_order);
                await this.repoFactory(Trigger).save(trigger, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.REORDER_LINKED_ENTITIES,
                    opConnectedModels: await this.repoFactory(Event).findByIds(trigger.eventIds),
                });
                return true;
            });
        },
        deleteTrigger: async (parent: any, args: any, ctx: CTX) => {
            const data = args.triggerDeleteInput;
            const trigger = await this.repoFactory(Trigger).findByIdThrows(
                new ObjectId(data.trigger_id),
                userMessages.triggerFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, trigger.orgId, async (me) => {
                const previewMode = data.preview === true;
                if (trigger.parentType === 'REVISION') {
                    //are there any rules with this trigger attached?
                    const rule = await this.repoFactory(Rule).findOne({
                        _global_trigger_id: trigger._persisting_id,
                        _revision_id: trigger.revisionId,
                    });
                    if (rule === null) {
                        if (!previewMode) {
                            await unLinkFromRevision(trigger, me, data.comments);
                        }
                    } else {
                        throw new GQLError(
                            userMessages.triggerDeletingUsed(rule.id.toString()),
                            true,
                        );
                    }
                } else {
                    throw new GQLError(userMessages.triggerDeletingRule, true);
                }

                return await deleteModelCascading(me, trigger, previewMode);
            });
        },
        updateTrigger: async (parent: any, args: any, ctx: CTX) => {
            const data = args.triggerUpdateInput;
            const trigger = await this.repoFactory(Trigger).findByIdThrows(
                new ObjectId(data.trigger_id),
                userMessages.triggerFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, trigger.orgId, async (me) => {
                trigger.bulkGQLSet(data, ['name']); //only is a safety check against this function
                await this.repoFactory(Trigger).save(trigger, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: data.comments,
                });
                return true;
            });
        },
        duplicateTrigger: async (parent: any, args: any, ctx: CTX) => {
            const duplicateTrigger = async (actor: User, trigger: Trigger): Promise<Trigger> => {
                if (trigger.parentType === 'RULE') {
                    throw new GQLError(userMessages.triggerDuplicateRule, true);
                } else {
                    const revision = await this.repoFactory(Revision).findByIdThrows(
                        trigger.revisionId,
                        userMessages.revisionFailed,
                    );
                    const newTrigger = await createNewModelBranchFromModel(
                        actor,
                        trigger,
                        TriggerRepo,
                    );
                    revision.globalTriggerIds = [...revision.globalTriggerIds, newTrigger.id];
                    await this.repoFactory(Revision).save(revision, actor, OperationOwner.USER, {
                        gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                        opConnectedModels: [newTrigger],
                    });
                    return newTrigger;
                }
            };
            const data = args.triggerDuplicateInput;
            const trigger = await this.repoFactory(Trigger).findByIdThrows(
                new ObjectId(data.trigger_id),
                userMessages.triggerFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, trigger.orgId, async (me) => {
                const duplicate = await duplicateTrigger(me, trigger);
                duplicate.name = data.name;
                return (
                    await this.repoFactory(Trigger).save(duplicate, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                        userComments: `Updated name of trigger to ${duplicate.name}`,
                    })
                ).toGQLType();
            });
        },
        createTrigger: async (parent: any, args: any, ctx: CTX) => {
            const data = args.triggerCreateInput;
            const revision = await this.repoFactory(Revision).findByIdThrows(
                new ObjectId(data.revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, revision.orgId, async (me) =>
                (await createGlobalTrigger(me, data.name, revision, data.comments)).toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Trigger: {
            revision: async (parent: any, args: any, ctx: CTX) => {
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    new ObjectID(parent.revision_id),
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, revision.orgId, async () =>
                    revision.toGQLType(),
                );
            },
            events: async (parent: any, args: any, ctx: CTX) => {
                const trigger = await this.repoFactory(Trigger).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.triggerFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, trigger.orgId, async () =>
                    (await this.repoFactory(Event).findByIds(trigger.eventIds)).map((_) =>
                        _.toGQLType(),
                    ),
                );
            },
            condition_rules: async (parent: any, args: any, ctx: CTX) => {
                const trigger = await this.repoFactory(Trigger).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.triggerFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, trigger.orgId, async () =>
                    (await this.repoFactory(ConditionRule).findByIds(trigger.conditionRuleIds)).map(
                        (_) => _.toGQLType(),
                    ),
                );
            },
            exception_rules: async (parent: any, args: any, ctx: CTX) => {
                const trigger = await this.repoFactory(Trigger).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.triggerFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, trigger.orgId, async () =>
                    (await this.repoFactory(ConditionRule).findByIds(trigger.exceptionRuleIds)).map(
                        (_) => _.toGQLType(),
                    ),
                );
            },
        },
    };
}
