import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import { ObjectId } from 'mongodb';
import PlatformDataContainer from '../../mongo/models/tag/PlatformDataContainer';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import PlatformAction from '../../mongo/models/tag/PlatformAction';
import PlatformEvent from '../../mongo/models/tag/PlatformEvent';
import Platform from '../../mongo/models/tag/Platform';
import CTX from '../../gql/ctx/CTX';
import PlatformAsset from '../../mongo/models/tag/PlatformAsset';
import GQLError from '../../errors/GQLError';
import GQLMethod from '../../enums/GQLMethod';
import userMessages from '../../errors/UserMessages';
import { revisionsJSONSafeDiff } from '../../utils/DiffUtils';
import { duplicateRevision } from '../../utils/RevisionUtils';
import User from '../../mongo/models/User';
import { BuildPlatformRevisionSchema, CT, GQLType } from '../../mongo/types/Types';
import {
    convertBuildPlatformDataMapSchemaToPlatformDataMap,
    covertPlatformDataMapInputsToBuildSchema,
} from '../../utils/PlatformDataMapUtils';
import Model from '../../mongo/abstractions/Model';
import { PlatformType } from '../../enums/PlatformType';
import { PlatformConfigOnly, PlatformInputSpec } from '../../../../common/interfaces/PlatformSpec';

@injectable()
export default class PlatformRevisionManager extends Manager<PlatformRevision> {
    protected gqlSchema = gql`
        input NewRevisionInput {
            """
            The \`Platform\` under which the new \`PlatformRevision\` should be created.
            """
            platform_id: ID!
            """
            The name of the new \`PlatformRevision\`
            """
            name: String!
            """
            A list of settings described as \`PlatformDataMap\`s that create a document style container of key => value pairs
            """
            settings: [PlatformDataMapInput!]
            """
            A list of events associated with this new \`PlatformRevision\`
            """
            events: [PlatformEventInput!]
            """
            A list of data containers (data layers) associated with this new \`PlatformRevision\`
            """
            data_containers: [PlatformDataContainerInput!]
            """
            A list of actions associated with this new \`PlatformRevision\`
            """
            actions: [PlatformActionInput!]
            """
            Whether or not to automatically publish this revision once all the models have been sucessfully created. By default the value here is false
            """
            publish: Boolean = false
        }

        input PublishPlatformRevisionInput {
            """
            The ID of the \`PlatformRevision\` to be marked as published
            """
            platform_revision_id: ID!
        }

        """
        @model
        """
        type PlatformRevision {
            """
            ID of the \`PlatformRevision\`
            """
            id: ID!
            """
            The \`Platform\` that owns this \`PlatformRevision\`
            """
            platform: Platform!
            """
            The name of the \`PlatformRevision\`
            """
            name: String!
            """
            A list of \`PlatformDataMap\`s that create a document style container of key => value pairs
            """
            platform_settings: [PlatformDataMap!]!
            """
            A list of assets that are associated with this \`PlatformRevision\`
            """
            platform_assets: [PlatformAsset!]!
            """
            A list of actions that are associated with this \`PlatformRevision\`
            """
            platform_actions: [PlatformAction!]!
            """
            A list of data containers (data layers) that are associated with this \`PlatformRevision\`
            """
            platform_data_containers: [PlatformDataContainer!]!
            """
            A list of events that are associated with this \`PlatformRevision\`
            """
            platform_events: [PlatformEvent!]!
            """
            Whether or not the \`PlatformRevision\` has been locked or not. When locked no future changes can be made to the \`PlatformRevision\` or any of its connected entities
            """
            locked: Boolean!
            """
            Whether or not the \`PlatformRevision\` has been published. Once published the \`PlatformRevision\` can be installed by publishers in to their \`App\`s.
            """
            is_published: Boolean!
            """
            The date the \`PlatformRevision\` was created
            """
            created_at: DateTime!
            """
            The date the \`PlatformRevision\` was last updated
            """
            updated_at: DateTime!
        }

        input DuplicatePlatformRevisionInput {
            """
            ID of the platform revision to be duplicated
            """
            platform_revision_id: ID!
            """
            Optionally provide a new name for the platform revision
            """
            new_name: String
        }

        """
        Update a \`PlatformRevision\`'s properties
        """
        input RevisionPlatformUpdateInput {
            """
            \`PlatformRevision\` ID to update data against
            """
            platform_revision_id: ID!
            """
            \`PlatformRevision\` name
            """
            name: String
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=PlatformRevision
            Create a new \`PlatformRevision\` from the input spec.
            """
            createNewPlatformRevision(newRevisionInput: NewRevisionInput!): PlatformRevision!
            """
            @bound=PlatformRevision
            This will attempt to finalise and publish the \`PlatformRevision\` and make it avalible for publishers to use, implement and upgrade to.
            """
            publishPlatformRevision(
                publishPlatformRevisionInput: PublishPlatformRevisionInput!
            ): Boolean!
            """
            @bound=PlatformRevision
            Duplicate platform revision will clone any linked items and return a new platform revision
            """
            duplicatePlatformRevision(
                duplicatePlatformRevisionInput: DuplicatePlatformRevisionInput!
            ): PlatformRevision!
            """
            @bound=PlatformRevision
            Update a \`PlatformRevision\`'s details.
            """
            updatePlatformRevision(
                revisionPlatformUpdateInput: RevisionPlatformUpdateInput!
            ): Boolean!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=PlatformRevision
            Returns a \`PlatformRevision\` associated withthe ID provided
            """
            getPlatformRevision(id: ID!): PlatformRevision!
            """
            @bound=PlatformRevision
            Provides the left and right comparison of two revisions
            """
            platformRevisionDifference(leftRevisionId: ID!, rightRevisionId: ID!): [RevisionDiff!]!
            """
            @bound=PlatformRevision
            Get a list of locked and published \`PlatformRevision\`'s.

            !> Note that if the \`Platform\` has not been made public \`PlatformRevision\`'s linked to that entity will not be in the list.
            """
            getPublishedPlatformRevisions(platformId: ID!): [PlatformRevision!]!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getPlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                new ObjectId(args.id),
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                ctx,
                platformRevision,
                async () => platformRevision.toGQLType(),
            );
        },
        platformRevisionDifference: async (parent: any, args: any, ctx: CTX) => {
            const left = await this.repoFactory(PlatformRevision).findByIdThrows(
                new ObjectId(args.leftRevisionId),
                userMessages.revisionFailed,
            );
            const right = await this.repoFactory(PlatformRevision).findByIdThrows(
                new ObjectId(args.rightRevisionId),
                userMessages.revisionFailed,
            );
            if (left.tagManagerAccountId.toString() !== right.tagManagerAccountId.toString()) {
                throw new GQLError(userMessages.incompatibleRevisions, true);
            }
            return this.orgAuth.asUserWithViewAccess(ctx, left.orgId, async () => {
                return await revisionsJSONSafeDiff(left, right);
            });
        },
        getPublishedPlatformRevisions: async (parent: any, args: any, ctx: CTX) => {
            const platform = await this.repoFactory(Platform).findOneThrows(
                {
                    _id: new ObjectId(args.platformId),
                    _is_public: true,
                },
                userMessages.platformFailed,
            );
            return this.userAuth.asUser(ctx, async () =>
                (
                    await this.repoFactory(PlatformRevision).find({
                        _platform_id: platform.id,
                        _is_final: true,
                        _is_published: true,
                    })
                ).map((_) => _.toGQLType()),
            );
        },
    };

    public async createRevisionFromPlatformConfig(
        actor: User,
        platform: Platform,
        config: PlatformConfigOnly,
        version: string,
        assets: Map<string, boolean>,
        publish: boolean,
    ) {
        const createPlatformMap = (
            platformInputSpec: PlatformInputSpec,
            parentKey?: string,
        ): any => {
            const persistenceId =
                parentKey === undefined
                    ? platformInputSpec.key
                    : `${parentKey}.${platformInputSpec.key}`;

            return {
                ...platformInputSpec,
                ...{
                    persistence_id: persistenceId,
                    child_platform_data_maps: (
                        platformInputSpec.child_platform_data_maps || []
                    ).map((_) => createPlatformMap(_, parentKey)),
                },
            };
        };
        const settings = (config.settings || []).map((_) => createPlatformMap(_));
        const events = (config.events || []).map((_) => {
            return {
                persistence_id: _.persistence_id,
                icon: _.icon,
                name: _.name,
                description: _.description,
                event: _.name,
                platform_data_maps: (_.data || []).map((_) => createPlatformMap(_)),
            };
        });
        const dataContainers = (config.data_containers || []).map((_) => {
            return {
                persistence_id: _.persistence_id,
                icon: _.icon,
                name: _.name,
                description: _.description,
                allow_custom: _.allow_custom,
                platform_data_maps: (_.data || []).map((_) => createPlatformMap(_)),
            };
        });
        const actions = (config.actions || []).map((_) => {
            return {
                persistence_id: _.persistence_id,
                icon: _.icon,
                name: _.name,
                description: _.description,
                platform_data_maps: (_.data || []).map((_) => createPlatformMap(_)),
            };
        });
        const revision = await this.createRevisionFromGQLInput(
            actor,
            {
                name: version,
                settings: settings,
                events: events,
                data_containers: dataContainers,
                actions: actions,
            },
            platform,
        );
        revision.platformAssetIds = (
            await Promise.all(
                Array.from(assets).map((value) => {
                    const [name, isPrimary] = value;
                    return this.repoFactory(PlatformAsset).save(
                        new PlatformAsset(name, revision, 'application/javascript', 0, isPrimary),
                        actor,
                    );
                }),
            )
        ).map((_) => _.id);
        revision.isFinal = publish;
        revision.isPublished = publish;
        return this.repoFactory(PlatformRevision).save(revision, actor);
    }

    protected async createRevisionFromGQLInput(
        actor: User,
        input: any,
        platform: Platform,
    ): Promise<PlatformRevision> {
        const convertBuildPlatformRevisionSchemaToPlatformRevision = async (
            actor: User,
            buildPlatformRevisionSchema: BuildPlatformRevisionSchema,
            platform: Platform,
        ): Promise<PlatformRevision> => {
            let revision = new PlatformRevision(buildPlatformRevisionSchema.name, platform);
            revision._persisting_id = 'platform-revision';
            revision = await this.repoFactory(PlatformRevision).save(revision, actor);
            //generate platform events ids...
            revision.platformEventIds = (
                await Promise.all(
                    (buildPlatformRevisionSchema.events || []).map(async (_) => {
                        const event = new PlatformEvent(
                            _.name,
                            revision,
                            _.description,
                            _.event,
                            await Promise.all(
                                (_.platform_data_maps || []).map((buildPlatformDataMapSchema) =>
                                    convertBuildPlatformDataMapSchemaToPlatformDataMap(
                                        actor,
                                        buildPlatformDataMapSchema,
                                        revision,
                                    ),
                                ),
                            ),
                            _.icon,
                        );
                        if (_.persistence_id !== undefined) {
                            event._persisting_id = _.persistence_id;
                        }
                        return await this.repoFactory(PlatformEvent).save(event, actor);
                    }),
                )
            ).map((_) => _.id);

            //generate platform data container ids...
            revision.platformDataContainerIds = (
                await Promise.all(
                    (buildPlatformRevisionSchema.data_containers || []).map(async (_) => {
                        const container = new PlatformDataContainer(
                            _.name,
                            _.description,
                            revision,
                            await Promise.all(
                                (_.platform_data_maps || []).map((buildPlatformDataMapSchema) =>
                                    convertBuildPlatformDataMapSchemaToPlatformDataMap(
                                        actor,
                                        buildPlatformDataMapSchema,
                                        revision,
                                    ),
                                ),
                            ),
                            _.allow_custom,
                            _.icon,
                        );
                        if (_.persistence_id !== undefined) {
                            container._persisting_id = _.persistence_id;
                        }
                        return await this.repoFactory(PlatformDataContainer).save(container, actor);
                    }),
                )
            ).map((_) => _.id);
            //generate platform action ids...
            revision.platformActionIds = (
                await Promise.all(
                    (buildPlatformRevisionSchema.actions || []).map(async (_) => {
                        const action = new PlatformAction(
                            _.name,
                            revision,
                            _.description,
                            await Promise.all(
                                (_.platform_data_maps || []).map((buildPlatformDataMapSchema) =>
                                    convertBuildPlatformDataMapSchemaToPlatformDataMap(
                                        actor,
                                        buildPlatformDataMapSchema,
                                        revision,
                                    ),
                                ),
                            ),
                            _.s2s_endpoint,
                            undefined,
                            undefined,
                            _.icon,
                        );
                        if (_.persistence_id !== undefined) {
                            action._persisting_id = _.persistence_id;
                        }
                        return await this.repoFactory(PlatformAction).save(action, actor);
                    }),
                )
            ).map((_) => _.id);
            //generate platform settings ids...
            revision.platformSettingsIds = (
                await Promise.all(
                    (buildPlatformRevisionSchema.settings || []).map((buildPlatformDataMapSchema) =>
                        convertBuildPlatformDataMapSchemaToPlatformDataMap(
                            actor,
                            buildPlatformDataMapSchema,
                            revision,
                        ),
                    ),
                )
            ).map((_) => _.id);
            //generate asset ids...
            revision.platformAssetIds = (
                await Promise.all(
                    (buildPlatformRevisionSchema.assets || []).map(async (_) => {
                        const asset = new PlatformAsset(
                            _.name,
                            revision,
                            _.mime_type,
                            0,
                            _.is_primary,
                        );
                        if (_.persistence_id !== undefined) {
                            asset._persisting_id = _.persistence_id;
                        }
                        return await this.repoFactory(PlatformAsset).save(asset, actor);
                    }),
                )
            ).map((_) => _.id);
            //finally save the revision...
            revision.isFinal = buildPlatformRevisionSchema.publish === true;
            revision.isPublished = buildPlatformRevisionSchema.publish === true;
            return await this.repoFactory(PlatformRevision).save(revision, actor);
        };

        const convertRevisionGQLInputToBuildSchema = (revisionInput: {
            [k: string]: any;
        }): BuildPlatformRevisionSchema => {
            return {
                name: revisionInput.name,
                settings: covertPlatformDataMapInputsToBuildSchema(revisionInput.settings),
                events:
                    revisionInput.events === undefined
                        ? []
                        : revisionInput.events.map((_: any) => {
                              return {
                                  persistence_id: _.persistence_id,
                                  name: _.name,
                                  description: _.description,
                                  event: _.event,
                                  platform_data_maps: covertPlatformDataMapInputsToBuildSchema(
                                      _.platform_data_maps,
                                  ),
                                  icon: _.icon,
                              };
                          }),
                data_containers:
                    revisionInput.data_containers === undefined
                        ? []
                        : revisionInput.data_containers.map((_: any) => {
                              return {
                                  persistence_id: _.persistence_id,
                                  name: _.name,
                                  description: _.description,
                                  allow_custom: _.allow_custom,
                                  platform_data_maps: covertPlatformDataMapInputsToBuildSchema(
                                      _.platform_data_maps,
                                  ),
                                  icon: _.icon,
                              };
                          }),
                actions:
                    revisionInput.actions === undefined
                        ? []
                        : revisionInput.actions.map((_: any) => {
                              return {
                                  persistence_id: _.persistence_id,
                                  name: _.name,
                                  s2s_endpoint: _.s2s_endpoint,
                                  description: _.description,
                                  platform_data_maps: covertPlatformDataMapInputsToBuildSchema(
                                      _.platform_data_maps,
                                  ),
                                  icon: _.icon,
                              };
                          }),
                publish: revisionInput.publish,
            };
        };

        return convertBuildPlatformRevisionSchemaToPlatformRevision(
            actor,
            convertRevisionGQLInputToBuildSchema(input),
            platform,
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updatePlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.revisionPlatformUpdateInput;
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                new ObjectId(data.platform_revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, platformRevision.orgId, async (me) => {
                platformRevision.bulkGQLSet(data, ['name']); //only is a safety check against this function
                await this.repoFactory(PlatformRevision).save(platformRevision, me, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: data.comments,
                });
                return true;
            });
        },
        duplicatePlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                new ObjectId(args.duplicatePlatformRevisionInput.platform_revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, platformRevision.orgId, async (me) => {
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    platformRevision.platformId,
                    userMessages.platformFailed,
                );
                if (platform.type === PlatformType.TEMPLATED) {
                    const newRevision = await duplicateRevision(me, platformRevision);
                    if (typeof args.duplicatePlatformRevisionInput.new_name === 'string') {
                        newRevision.name = args.duplicatePlatformRevisionInput.new_name;
                        return (
                            await this.repoFactory(PlatformRevision).save(newRevision, me, {
                                gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                                userComments: `Updated name of duplicate platform revision to ${newRevision.name}`,
                            })
                        ).toGQLType();
                    } else {
                        return newRevision.toGQLType();
                    }
                } else {
                    throw new GQLError(userMessages.duplicateCustomPlatformRevision, true);
                }
            });
        },
        publishPlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                new ObjectId(args.publishPlatformRevisionInput.platform_revision_id),
                userMessages.revisionFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, platformRevision.orgId, async (me) => {
                platformRevision.isFinal = true;
                platformRevision.isPublished = true;
                await this.repoFactory(PlatformRevision).save(platformRevision, me);
                return true;
            });
        },
        createNewPlatformRevision: async (parent: any, args: any, ctx: CTX) => {
            const data = args.newRevisionInput;
            const platform = await this.repoFactory(Platform).findByIdThrows(
                new ObjectId(data.platform_id),
                userMessages.platformFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, platform.orgId, async (me) => {
                //convert GQL revision input to build schema...
                return (
                    await this.createRevisionFromGQLInput(me, args.newRevisionInput, platform)
                ).toGQLType();
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        PlatformRevision: {
            platform: async (parent: any, args: any, ctx: CTX) => {
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    new ObjectId(parent.platform_id),
                    userMessages.platformFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatform(ctx, platform, async () =>
                    platform.toGQLType(),
                );
            },
            platform_settings: async (parent: any, args: any, ctx: CTX) => {
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () =>
                        (
                            await this.repoFactory(PlatformDataMap).findByIds(
                                platformRevision.platformSettingsIds,
                            )
                        ).map((_) => _.toGQLType()),
                );
            },
            platform_actions: async (parent: any, args: any, ctx: CTX) => {
                return this.getRevisionChildren(ctx, new ObjectId(parent.id), PlatformAction);
            },
            platform_data_containers: async (parent: any, args: any, ctx: CTX) => {
                return this.getRevisionChildren(
                    ctx,
                    new ObjectId(parent.id),
                    PlatformDataContainer,
                );
            },
            platform_events: async (parent: any, args: any, ctx: CTX) => {
                return this.getRevisionChildren(ctx, new ObjectId(parent.id), PlatformEvent);
            },
            platform_assets: async (parent: any, args: any, ctx: CTX) => {
                return this.getRevisionChildren(ctx, new ObjectId(parent.id), PlatformAsset);
            },
        },
    };

    private async getRevisionChildren<T extends Model>(
        ctx: CTX,
        platformRevisionId: ObjectId,
        modelInstance: CT<T>,
    ): Promise<GQLType[]> {
        const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
            platformRevisionId,
            userMessages.revisionFailed,
        );
        return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
            ctx,
            platformRevision,
            async () =>
                (
                    await this.repoFactory(modelInstance).find({
                        _revision_id: platformRevisionId,
                    })
                ).map((_) => _.toGQLType()),
        );
    }
}
