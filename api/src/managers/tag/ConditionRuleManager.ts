import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import ConditionRule from '../../mongo/models/tag/ConditionRule';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import PlatformDataContainer from '../../mongo/models/tag/PlatformDataContainer';
import Revision from '../../mongo/models/tag/Revision';
import GQLError from '../../errors/GQLError';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import Trigger from '../../mongo/models/tag/Trigger';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { deleteModelCascading } from '../../utils/ModelUtils';
import RevisionRepo from '../../mongo/repos/tag/RevisionRepo';

@injectable()
export default class ConditionRuleManager extends Manager<ConditionRule> {
    protected gqlSchema = gql`
        """
        To be used with \`ConditionRuleCreateInput\`
        """
        enum ConditionMode {
            """
            If the \`ConditionRule\` is a **condition** to be applied to the \`Rule\`
            """
            CONDITION
            """
            If the \`ConditionRule\` is an **exception** to be applied to the \`Rule\`
            """
            EXCEPTION
        }

        """
        @type
        A custom match container
        """
        type CustomMatch {
            """
            The data key to match against
            """
            custom_key: String!
        }

        """
        @union
        Match can either be a custom key (string) or a direct property of some DataMap
        """
        union ConditionMatch = CustomMatch | PlatformDataMap

        """
        @model
        """
        type ConditionRule {
            """
            \`ConditionRule\` ID
            """
            id: ID!
            """
            \`ConditionRule\` name
            """
            name: String!
            """
            \`ConditionRule\` type, see \`ConditionMatch\` enum.
            """
            match: ConditionMatch!
            """
            Match key (used on object types)
            """
            match_key: String
            """
            Match condition, see \`ConditionType\` enum.
            """
            match_condition: ConditionType!
            """
            Match value (see \`DataMapValue\`), the value to match againt data property key specificed by \`ConditionMatch\`.
            """
            match_value: DataMapValue!
            """
            The \`PlatformDataContainer\` to match against
            """
            platform_data_container: PlatformDataContainer!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=ConditionRule
            Get a \`ConditionRule\` model from the \`ConditionRule\` ID
            """
            getConditionRule(id: ID!): ConditionRule!
        }

        """
        Either 'match' or 'match_id' must be provided when updating a match value. See \`ConditionMatch\` for more information.
        """
        input ConditionRuleUpdateInput {
            """
            \`ConditionRule\` ID to update against
            """
            condition_rule_id: ID!
            """
            The name of the new \`ConditionRule\`
            """
            name: String
            """
            The custom value to match against
            """
            match: String
            """
            The \`PlatformDataMap\` value to match against
            """
            match_id: ID
            """
            Match key (used on object types)
            """
            match_key: String
            """
            The \`PlatformDataMap\` condition to match against. See \`ConditionType\` enum.
            """
            match_condition: ConditionType
            """
            The \`PlatformDataMap\` value to match against (see \`DataMapValue\`).
            """
            match_value: DataMapValue
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        """
        Either 'match' or 'match_id' must be provided. See \`ConditionMatch\` for more information.
        """
        input ConditionRuleCreateInput {
            """
            Is this a condition or exception when attaching to the \`Trigger\`?
            """
            condition_mode: ConditionMode!
            """
            The \`Trigger\` under which the \`ConditionRule\` should be created
            """
            trigger_id: ID!
            """
            The \`PlatformDataContainer\` under which data layer exists
            """
            platform_data_container_id: ID!
            """
            The name of the new \`ConditionRule\`
            """
            name: String!
            """
            The custom value to match against
            """
            match: String
            """
            Match key (used on object types)
            """
            match_key: String
            """
            The \`PlatformDataMap\` value to match against
            """
            match_id: ID
            """
            The \`PlatformDataMap\` condition to match against. See \`ConditionType\` enum.
            """
            match_condition: ConditionType!
            """
            The \`PlatformDataMap\` value to match against (see \`DataMapValue\`).
            """
            match_value: DataMapValue!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input ConditionRuleDeleteInput {
            """
            \`ConditionRule\` ID to delete against
            """
            condition_rule_id: ID!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=ConditionRule
            Create a new \`ConditionRule\`. \`Trigger\` ID is required here to ensure \`ConditionRule\` is placed inside the correct \`Trigger\`
            """
            createConditionRule(conditionRuleCreateInput: ConditionRuleCreateInput!): Rule!
            """
            @bound=ConditionRule
            Update a \`ConditionRule\`.
            """
            updateConditionRule(conditionRuleUpdateInput: ConditionRuleUpdateInput!): Boolean!
            """
            @bound=ConditionRule
            Delete a \`ConditionRule\` and its children.
            """
            deleteConditionRule(
                conditionRuleDeleteInput: ConditionRuleDeleteInput!
            ): [ModelDeleteAcknowledgement!]!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getConditionRule: async (parent: any, args: any, ctx: CTX) => {
            const conditionRule = await this.repoFactory(ConditionRule).findByIdThrows(
                new ObjectId(args.id),
                userMessages.conditionFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, conditionRule.orgId, async () =>
                conditionRule.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateConditionRule: async (parent: any, args: any, ctx: CTX) => {
            const data = args.conditionRuleUpdateInput;
            const conditionRule = await this.repoFactory(ConditionRule).findByIdThrows(
                new ObjectId(data.condition_rule_id),
                userMessages.conditionFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, conditionRule.orgId, async (me) => {
                if (data.match_id !== undefined || data.match !== undefined) {
                    //we need to update our match criteria..
                    const platformDataContainer = await this.repoFactory(
                        PlatformDataContainer,
                    ).findByIdThrows(
                        conditionRule.platformDataContainerId,
                        userMessages.dataMapFailed,
                    );

                    conditionRule.updateMatch(
                        platformDataContainer,
                        await this.findAndValidateMatch(data, platformDataContainer),
                    );
                }
                conditionRule.bulkGQLSet(data, [
                    'name',
                    'match_condition',
                    'match_value',
                    'match_key',
                ]);
                await this.repoFactory(ConditionRule).save(conditionRule, me, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: data.comments,
                });
                return true;
            });
        },
        deleteConditionRule: async (parent: any, args: any, ctx: CTX) => {
            const data = args.conditionRuleDeleteInput;
            const conditionRule = await this.repoFactory(ConditionRule).findByIdThrows(
                new ObjectId(data.condition_rule_id),
                userMessages.conditionFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, conditionRule.orgId, async (me) => {
                //who is the parent?
                const trigger = await this.repoFactory(Trigger).findOneThrows(
                    {
                        $or: [
                            { _condition_rule_ids: conditionRule.id },
                            { _exception_rule_ids: conditionRule.id },
                        ],
                    },
                    userMessages.triggerFailed,
                );
                trigger.conditionRuleIds = trigger.conditionRuleIds.filter(
                    (_) => !_.equals(conditionRule.id),
                );
                trigger.exceptionRuleIds = trigger.exceptionRuleIds.filter(
                    (_) => !_.equals(conditionRule.id),
                );
                await this.repoFactory(Trigger).save(trigger, me, {
                    gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                    userComments: data.comments,
                    opConnectedModels: [conditionRule],
                });
                return await deleteModelCascading(me, conditionRule);
            });
        },
        createConditionRule: async (parent: any, args: any, ctx: CTX) => {
            const getValidPlatformDataContainers = async (
                revision: Revision,
            ): Promise<PlatformDataContainer[]> => {
                return await this.repoFactory(PlatformDataContainer).findByIds(
                    (
                        await this.repoFactory<RevisionRepo>(Revision).getValidPlatformRevisions(
                            revision,
                        )
                    )
                        .map((_) => _.platformDataContainerIds)
                        .flat(),
                );
            };

            const data = args.conditionRuleCreateInput;
            const trigger = await this.repoFactory(Trigger).findByIdThrows(
                new ObjectId(data.trigger_id),
                userMessages.triggerFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, trigger.orgId, async (me) => {
                //create a new entity...
                const platformDataContainer = await this.repoFactory(
                    PlatformDataContainer,
                ).findByIdThrows(
                    new ObjectId(data.platform_data_container_id),
                    userMessages.dataMapFailed,
                );

                const revision = await this.repoFactory(Revision).findByIdThrows(
                    trigger.revisionId,
                    userMessages.revisionFailed,
                );

                if (
                    (await getValidPlatformDataContainers(revision)).find((_) =>
                        _.id.equals(platformDataContainer.id),
                    ) === undefined
                ) {
                    throw new GQLError(userMessages.conditionDCInvalid, true);
                }

                const newConditionRule = await this.repoFactory(ConditionRule).save(
                    new ConditionRule(
                        data.name,
                        revision,
                        platformDataContainer,
                        await this.findAndValidateMatch(data, platformDataContainer),
                        data.match_condition,
                        data.match_value,
                        data.match_key,
                    ),
                    me,
                    {
                        gqlMethod: GQLMethod.CREATE,
                        userComments: data.comments,
                    },
                );

                //link this back to the parent entity...
                if (data.condition_mode === 'EXCEPTION') {
                    trigger.exceptionRuleIds = [...trigger.exceptionRuleIds, newConditionRule.id];
                } else {
                    trigger.conditionRuleIds = [...trigger.conditionRuleIds, newConditionRule.id];
                }
                await this.repoFactory(Trigger).save(trigger, me, {
                    gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                    opConnectedModels: [newConditionRule],
                });

                //finally return the new entity
                return newConditionRule.toGQLType();
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        ConditionRule: {
            match: async (parent: any, args: any, ctx: CTX) => {
                const conditionRule = await this.repoFactory(ConditionRule).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.conditionFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, conditionRule.orgId, async () => {
                    if (typeof conditionRule.match === 'string') {
                        return { custom_key: conditionRule.match };
                    } else {
                        return (
                            await this.repoFactory(PlatformDataMap).findByIdThrows(
                                conditionRule.match,
                                userMessages.dataMapFailed,
                            )
                        ).toGQLType();
                    }
                });
            },
            platform_data_container: async (parent: any, args: any, ctx: CTX) => {
                const conditionRule = await this.repoFactory(ConditionRule).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.conditionFailed,
                );
                const platformDataContainer = await this.repoFactory(
                    PlatformDataContainer,
                ).findByIdThrows(conditionRule.platformDataContainerId, userMessages.dataMapFailed);
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataContainer.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () => platformDataContainer.toGQLType(),
                );
            },
        },
        ConditionMatch: {
            __resolveType: (obj: any) => {
                if (obj.custom_key !== undefined) {
                    return 'CustomMatch';
                } else if (obj.id !== undefined) {
                    return 'PlatformDataMap';
                }
                return null;
            },
        },
    };

    private async getMatch(matchId?: string, match?: string): Promise<string | PlatformDataMap> {
        if (matchId !== undefined) {
            return await this.repoFactory(PlatformDataMap).findByIdThrows(
                new ObjectId(matchId),
                userMessages.dataMapFailed,
            );
        } else if (typeof match === 'string') {
            return match;
        } else {
            throw new GQLError(userMessages.conditionMissingMatchProperties, true);
        }
    }

    private async getValidPlatformDataMapIdsFromPlatformDataContainer(
        platformDataContainer: PlatformDataContainer,
    ): Promise<ObjectId[]> {
        const getAllPlatformDataMaps = async (
            parent: PlatformDataMap,
        ): Promise<PlatformDataMap[]> => {
            const children = await this.repoFactory(PlatformDataMap).findByIds(
                parent.childPlatformDataMapIds,
            );
            return [
                parent,
                ...(await Promise.all(children.map((_) => getAllPlatformDataMaps(_)))).flat(),
            ];
        };
        return (
            await Promise.all(
                (
                    await this.repoFactory(PlatformDataMap).findByIds(
                        platformDataContainer.platformDataMapIds,
                    )
                ).map((_) => getAllPlatformDataMaps(_)),
            )
        )
            .flat()
            .map((_) => _.id);
    }

    private async findAndValidateMatch(data: any, platformDataContainer: PlatformDataContainer) {
        const match = await this.getMatch(data.match_id, data.match);

        if (typeof match === 'string' && !platformDataContainer.allowCustom) {
            throw new GQLError(userMessages.conditionMatchNotAllowed, true);
        }
        if (typeof match !== 'string') {
            const validIds = await this.getValidPlatformDataMapIdsFromPlatformDataContainer(
                platformDataContainer,
            );
            if (validIds.find((_) => _.equals(match.id)) === undefined) {
                throw new GQLError(userMessages.conditionMatchInvalid, true);
            }
        }
        return match;
    }
}
