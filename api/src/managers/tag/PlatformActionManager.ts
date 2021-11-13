import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import PlatformAction from '../../mongo/models/tag/PlatformAction';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import Platform from '../../mongo/models/tag/Platform';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import PlatformActionPermission from '../../mongo/models/tag/PlatformActionPermission';
import GQLError from '../../errors/GQLError';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { deleteModelCascading } from '../../utils/ModelUtils';
import {
    convertBuildPlatformDataMapSchemaToPlatformDataMap,
    covertPlatformDataMapInputsToBuildSchema,
} from '../../utils/PlatformDataMapUtils';
import User from '../../mongo/models/User';
import { PlatformType } from '../../enums/PlatformType';

@injectable()
export default class PlatformActionManager extends Manager<PlatformAction> {
    protected gqlSchema = gql`
        """
        @model
        """
        type PlatformAction {
            """
            ID of the \`PlatformAction\`
            """
            id: ID!
            """
            Persisting ID, this reference will stay the same across all revisions of this entity
            """
            persisting_id: String!
            """
            Icon
            """
            icon: TypeIcon
            """
            Name of the \`PlatformAction\`
            """
            name: String!
            """
            Description of the \`PlatformAction\`
            """
            description: String!
            """
            Code, if applicable and running in templated mode.
            """
            code: String
            """
            [Optional]. This will force the \`PlatformAction\` server side and direct the payload described in 'platform_data_maps' as JSON POST request at the provided server-to-server endpoint.
            """
            s2s_endpoint: String
            """
            If the code should be executed in an iframe, bypassing the sandbox and effectively executing as raw code.
            """
            exec_raw_in_iframe: Boolean!
            """
            \`Platform\` that contains this \`PlatformAction\`
            """
            platform: Platform!
            """
            \`PlatformRevision\` that contains this \`PlatformAction\`
            """
            platform_revision: PlatformRevision!
            """
            List of \`PlatformDataMap\`s that create a document style key => value map. This can be directly accessed by the action when called.
            """
            platform_data_maps: [PlatformDataMap!]!
            """
            List of \`PlatformActionPermission\`s linked to this action
            """
            permissions_requests: [PlatformActionPermission!]!
        }

        input PlatformActionInput {
            """
            The persistence id associated with this \`PlatformAction\`. This ID should be unique to the action, however it can be shared across \`PlatformRevision\`s. We will provide a difference between two \`PlatformRevision\`s when they have the same persistence id.
            """
            persistence_id: String!
            """
            The name of the new \`PlatformAction\` being created.
            """
            name: String!
            """
            [Optional]. This will force the \`PlatformAction\` server side and direct the payload described in 'platform_data_maps' as JSON POST request at the provided server-to-server endpoint.
            """
            s2s_endpoint: String
            """
            Optional Icon
            """
            icon: TypeIcon
            """
            The description of the new \`PlatformAction\` being created.
            """
            description: String!
            """
            A list of action inputs described as \`PlatformDataMap\`s.
            """
            platform_data_maps: [PlatformDataMapInput!]
        }

        input PlatformActionTemplatedDataMapCreateInput {
            """
            The key of the new \`PlatformDataMap\`
            """
            key: String!
            """
            Description
            """
            description: String = "A description has not been provided"
            """
            Optional Icon
            """
            icon: TypeIcon
            """
            (See \`InputType\`)
            """
            input_type: InputType!
            """
            An optional default value to be applied when the value from the data layer is not retrievable
            """
            default_value: DataMapValue
            """
            An optional list of default values to be applied when the value from the data layer is not retrievable
            """
            default_values: [DataMapValue!]
            """
            An optional list of values to be used with SELECT or RADIO \`InputType\`
            """
            option_values: [DataMapValue!]
            """
            If \`VarType\` is an OBJECT or ARRAY_OBJECT then it may contain child key => value pairs.
            """
            child_platform_data_maps: [PlatformActionTemplatedDataMapCreateInput!]
            """
            Whether or not this \`PlatformDataMap\` is optional. We will flag missing data in debug mode (console).
            """
            optional: Boolean
            """
            Optional validation rules
            """
            validation_rules: [PlatformDataMapValidationInput!]
        }

        input PlatformActionTemplatedCreateInput {
            """
            The ID of the \`PlatformRevision\` under which the \`PlatformAction\` is being created.
            """
            platform_revision_id: ID!
            """
            The name of the new \`PlatformAction\` being created.
            """
            name: String!
            """
            The description of the new \`PlatformAction\` being created.
            """
            description: String!
            """
            Optional Icon
            """
            icon: TypeIcon
            """
            Template code, see docs.
            """
            code: String!
            """
            A list of action inputs described as \`PlatformDataMap\`s.
            """
            platform_data_maps: [PlatformActionTemplatedDataMapCreateInput!]
            """
            A list of action inputs described as \`PlatformDataMap\`s.
            """
            permission_requests: [PlatformActionPermissionTemplatedCreateInput!]
            """
            If the code should be executed in an iframe, bypassing the sandbox and effectively executing as raw code.
            """
            exec_raw_in_iframe: Boolean
        }

        input PlatformActionTemplatedUpdateInput {
            """
            The ID of the \`PlatformAction\` to be updated.
            """
            platform_action_id: ID!
            """
            The name of the new \`PlatformAction\` being created.
            """
            name: String
            """
            The description of the new \`PlatformAction\` being created.
            """
            description: String
            """
            Optional Icon
            """
            icon: TypeIcon
            """
            Template code, see docs.
            """
            code: String
            """
            A list of action inputs described as \`PlatformDataMap\`s.
            """
            platform_data_maps: [PlatformActionTemplatedDataMapCreateInput!]
            """
            A list of action inputs described as \`PlatformDataMap\`s.
            """
            permission_requests: [PlatformActionPermissionTemplatedCreateInput!]
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input PlatformActionTemplatedDeleteInput {
            """
            The ID of the \`PlatformAction\` to be deleted.
            """
            platform_action_id: ID!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=PlatformAction
            Method will return a \`PlatformAction\` instance from its ID.
            """
            getPlatformAction(id: ID!): PlatformAction!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=PlatformAction
            Create a new templated \`PlatformAction\`
            """
            createTemplatedAction(
                platformActionTemplatedCreateInput: PlatformActionTemplatedCreateInput!
            ): PlatformAction!
            """
            @bound=PlatformAction
            Update a templated \`PlatformAction\`
            """
            updateTemplatedAction(
                platformActionTemplatedUpdateInput: PlatformActionTemplatedUpdateInput!
            ): Boolean!
            """
            @bound=PlatformAction
            Delete a templated \`PlatformAction\`
            """
            deleteTemplatedAction(
                platformActionTemplatedDeleteInput: PlatformActionTemplatedDeleteInput!
            ): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        deleteTemplatedAction: async (parent: any, args: any, ctx: CTX) => {
            const data = args.platformActionTemplatedDeleteInput;
            const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                new ObjectId(data.platform_action_id),
                userMessages.actionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, platformAction.orgId, async (me) => {
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    platformAction.platformId,
                    userMessages.platformFailed,
                );
                if (platform.type === PlatformType.TEMPLATED) {
                    const platformRevision = await this.repoFactory(
                        PlatformRevision,
                    ).findByIdThrows(
                        platformAction.platformRevisionId,
                        userMessages.revisionFailed,
                    );
                    platformRevision.platformActionIds = platformRevision.platformActionIds.filter(
                        (_) => !_.equals(platformAction.id),
                    );
                    await this.repoFactory(PlatformRevision).save(platformRevision, me);
                    await deleteModelCascading(me, platformAction);
                    return true;
                } else {
                    throw new GQLError(userMessages.platformDeleteInvalid, true);
                }
            });
        },
        createTemplatedAction: async (parent: any, args: any, ctx: CTX) => {
            const data = args.platformActionTemplatedCreateInput;
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                new ObjectId(data.platform_revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, platformRevision.orgId, async (me) => {
                const platformDataMapSchema = covertPlatformDataMapInputsToBuildSchema(
                    data.platform_data_maps,
                );
                const platformDataMaps: PlatformDataMap[] = await Promise.all(
                    platformDataMapSchema.map((_) =>
                        convertBuildPlatformDataMapSchemaToPlatformDataMap(me, _, platformRevision),
                    ),
                );
                const platformActionPermissions: PlatformActionPermission[] = await Promise.all(
                    ((data.permission_requests as any[]) || []).map(
                        (_: any): Promise<PlatformActionPermission> => {
                            return this.buildFromPlatformActionPermissionTemplatedCreateInput(
                                me,
                                _,
                                platformRevision,
                            );
                        },
                    ),
                );
                const newPlatformAction = await this.repoFactory(PlatformAction).save(
                    new PlatformAction(
                        data.name,
                        platformRevision,
                        data.description,
                        platformDataMaps,
                        undefined,
                        data.code,
                        platformActionPermissions,
                        data.icon,
                        data.exec_raw_in_iframe,
                    ),
                    me,
                );
                platformRevision.platformActionIds = [
                    ...platformRevision.platformActionIds,
                    newPlatformAction.id,
                ];
                await this.repoFactory(PlatformRevision).save(platformRevision, me);
                return newPlatformAction.toGQLType();
            });
        },
        updateTemplatedAction: async (parent: any, args: any, ctx: CTX) => {
            const data = args.platformActionTemplatedUpdateInput;
            const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                new ObjectId(data.platform_action_id),
                userMessages.actionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, platformAction.orgId, async (me) => {
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    platformAction.platformId,
                    userMessages.platformFailed,
                );
                if (platform.type === PlatformType.TEMPLATED) {
                    const platformRevision = await this.repoFactory(
                        PlatformRevision,
                    ).findByIdThrows(
                        platformAction.platformRevisionId,
                        userMessages.revisionFailed,
                    );
                    platformAction.bulkGQLSet(data, ['name', 'description', 'code', 'icon']);
                    //check for platform data maps...
                    if (Array.isArray(data.platform_data_maps)) {
                        //need to build new data maps and bind back...
                        const platformDataMapSchema = covertPlatformDataMapInputsToBuildSchema(
                            data.platform_data_maps,
                        );
                        const platformDataMaps: PlatformDataMap[] = await Promise.all(
                            platformDataMapSchema.map((_) =>
                                convertBuildPlatformDataMapSchemaToPlatformDataMap(
                                    me,
                                    _,
                                    platformRevision,
                                ),
                            ),
                        );
                        //delete the old ones...
                        const oldPlatformDataMaps = await this.repoFactory(
                            PlatformDataMap,
                        ).findByIds(platformAction.platformDataMapIds);
                        platformAction.platformDataMapIds = platformDataMaps.map((_) => _.id);
                        await Promise.all(
                            oldPlatformDataMaps.map((_) => deleteModelCascading(me, _)),
                        );
                    }
                    if (Array.isArray(data.permission_requests)) {
                        const platformActionPermissions: PlatformActionPermission[] =
                            await Promise.all(
                                ((data.permission_requests as any[]) || []).map(
                                    (_: any): Promise<PlatformActionPermission> => {
                                        return this.buildFromPlatformActionPermissionTemplatedCreateInput(
                                            me,
                                            _,
                                            platformRevision,
                                        );
                                    },
                                ),
                            );
                        const oldPlatformActionPermissions = await this.repoFactory(
                            PlatformActionPermission,
                        ).findByIds(platformAction.platformActionPermissionIds);
                        platformAction.platformActionPermissionIds = platformActionPermissions.map(
                            (_) => _.id,
                        );
                        await Promise.all(
                            oldPlatformActionPermissions.map((_) => deleteModelCascading(me, _)),
                        );
                    }
                    await this.repoFactory(PlatformAction).save(
                        platformAction,
                        me,
                        OperationOwner.USER,
                        {
                            gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                            userComments: data.comments,
                        },
                    );
                    return true;
                } else {
                    throw new GQLError(userMessages.platformUpdateInvalid, true);
                }
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getPlatformAction: async (parent: any, args: any, ctx: CTX) => {
            const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                new ObjectId(args.id),
                userMessages.actionFailed,
            );
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                platformAction.platformRevisionId,
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                ctx,
                platformRevision,
                () => platformAction.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        PlatformAction: {
            permissions_requests: async (parent: any, args: any, ctx: CTX) => {
                const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.actionFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformAction.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () =>
                        (
                            await this.repoFactory(PlatformActionPermission).findByIds(
                                platformAction.platformActionPermissionIds,
                            )
                        ).map((_) => _.toGQLType()),
                );
            },
            platform: async (parent: any, args: any, ctx: CTX) => {
                const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.actionFailed,
                );
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    platformAction.platformId,
                    userMessages.platformFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatform(ctx, platform, () =>
                    platform.toGQLType(),
                );
            },
            platform_revision: async (parent: any, args: any, ctx: CTX) => {
                const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.actionFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformAction.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    () => platformRevision.toGQLType(),
                );
            },
            platform_data_maps: async (parent: any, args: any, ctx: CTX) => {
                const platformAction = await this.repoFactory(PlatformAction).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.actionFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformAction.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () =>
                        (
                            await this.repoFactory(PlatformDataMap).findByIds(
                                platformAction.platformDataMapIds,
                            )
                        ).map((_) => _.toGQLType()),
                );
            },
        },
    };

    private async buildFromPlatformActionPermissionTemplatedCreateInput(
        actor: User,
        input: any,
        platformRevision: PlatformRevision,
    ): Promise<PlatformActionPermission> {
        return await this.repoFactory(PlatformActionPermission).save(
            new PlatformActionPermission(
                input.permission,
                platformRevision,
                input.variable_read_write_execute_scopes,
                input.url_parts,
                input.host_matches,
                input.event_names,
            ),
            actor,
        );
    }
}
