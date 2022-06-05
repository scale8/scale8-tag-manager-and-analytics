import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import Platform from '../../mongo/models/tag/Platform';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import TagManagerAccount from '../../mongo/models/tag/TagManagerAccount';
import GQLError from '../../errors/GQLError';
import GQLMethod from '../../enums/GQLMethod';
import OperationOwner from '../../enums/OperationOwner';
import userMessages from '../../errors/UserMessages';
import { PlatformType } from '../../enums/PlatformType';
import { generateRevisionName } from '../../../../common/utils/GenerateRevisionName';

@injectable()
export default class PlatformManager extends Manager<Platform> {
    protected gqlSchema = gql`
        """
        @model
        """
        type Platform {
            """
            \`Platform\` ID
            """
            id: ID!
            """
            Platform type
            """
            type: PlatformType!
            """
            The \`TagManagerAccount\` that contains this \`Platform\`
            """
            tag_manager_account: TagManagerAccount!
            """
            \`Platform\` name
            """
            name: String!
            """
            \`Platform\` description
            """
            description: String!
            """
            \`PlatformRevision\`s the are linked to this \`Platform\`. Please note that if the \`Platform\` has been made public and \`PlatformRevision\` has been published, it will be avalible to ***any*** Scale8 Tag Manager User to install in their \`App\`
            """
            platform_revisions: [PlatformRevision!]!
            """
            If the platform has been published, this flag will be true.
            """
            is_public: Boolean!
            """
            Date the \`Platform\` was created at
            """
            created_at: DateTime!
            """
            Date the \`Platform\` was last updated at
            """
            updated_at: DateTime!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Platform
            Method will return a \`Platform\` instance from its ID.

            !> Note that if the \`Platform\` has been made public, it will be accessible to ***any*** Scale8 Tag Manager User.
            """
            getPlatform(id: ID!): Platform!
            """
            @bound=Platform
            Method will return a list of public \`Platform\`'s.

            !> Note that if the \`Platform\` has not been made public it will not be in the list.
            """
            getPublicPlatforms: [Platform!]!
        }

        input PlatformCreateInput {
            """
            Platform type
            """
            type: PlatformType!
            """
            ID of the \`TagManagerAccount\` under which to create the platform
            """
            tag_manager_account_id: ID!
            """
            Name of the new \`Platform\`
            """
            name: String!
            """
            Description of the new \`Platform\`
            """
            description: String!
        }

        input PlatformUpdateInput {
            """
            ID of the \`Platform\` to be updated
            """
            platform_id: ID!
            """
            Name of the \`Platform\`
            """
            name: String
            """
            Description of the \`Platform\`
            """
            description: String
        }

        input PlatformPublishInput {
            """
            ID of the \`Platform\` to be updated
            """
            platform_id: ID!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Platform
            Create a new \`Platform\`.
            """
            createPlatform(platformCreateInput: PlatformCreateInput!): Platform!
            """
            @bound=Platform
            Update a \`Platform\`.
            """
            updatePlatform(platformUpdateInput: PlatformUpdateInput!): Boolean!
            """
            @bound=Platform
            Update a \`Platform\`.
            """
            publishPlatform(platformPublishInput: PlatformPublishInput!): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        createPlatform: async (parent: any, args: any, ctx: CTX) => {
            const data = args.platformCreateInput;
            const tagManagerAccount = await this.repoFactory(TagManagerAccount).findByIdThrows(
                new ObjectId(data.tag_manager_account_id),
                userMessages.accountFailed,
            );
            return await this.orgAuth.asUserWithCreateAccess(
                ctx,
                tagManagerAccount.orgId,
                async (me) => {
                    if (me.isAdmin) {
                        const platform = await this.repoFactory(Platform).save(
                            new Platform(data.type, data.name, data.description, tagManagerAccount),
                            me,
                            {
                                gqlMethod: GQLMethod.CREATE,
                            },
                        );
                        if (platform.type === PlatformType.TEMPLATED) {
                            //we have to create the first revision automatically...
                            await this.repoFactory(PlatformRevision).save(
                                new PlatformRevision(generateRevisionName(), platform),
                                me,
                                {
                                    gqlMethod: GQLMethod.CREATE,
                                    userComments:
                                        'Auto-generated the first revision for the platform',
                                },
                            );
                        }
                        return platform.toGQLType();
                    } else {
                        throw new GQLError(userMessages.featureInBeta, true);
                    }
                },
            );
        },
        updatePlatform: async (parent: any, args: any, ctx: CTX) => {
            const data = args.platformUpdateInput;
            const platform = await this.repoFactory(Platform).findByIdThrows(
                new ObjectId(data.platform_id),
                userMessages.platformFailed,
            );
            return await this.orgAuth.asUserWithCreateAccess(ctx, platform.orgId, async (me) => {
                platform.bulkGQLSet(data, ['name', 'description', 'logo']);
                await this.repoFactory(Platform).save(platform, me, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                });
                return true;
            });
        },
        publishPlatform: async (parent: any, args: any, ctx: CTX) => {
            const data = args.platformPublishInput;
            const platform = await this.repoFactory(Platform).findByIdThrows(
                new ObjectId(data.platform_id),
                userMessages.platformFailed,
            );
            return await this.orgAuth.asUserWithCreateAccess(ctx, platform.orgId, async (me) => {
                const platformRevision = await this.repoFactory(PlatformRevision).findOne({
                    _platform_id: platform.id,
                    _is_published: true,
                });
                if (platformRevision === null) {
                    throw new GQLError(userMessages.platformPublishNoRevision, true);
                } else {
                    platform.isPublic = true;
                    await this.repoFactory(Platform).save(platform, me, {
                        gqlMethod: GQLMethod.PUBLISH_PLATFORM,
                    });
                    return true;
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
        getPlatform: async (parent: any, args: any, ctx: CTX) => {
            const platform = await this.repoFactory(Platform).findByIdThrows(
                new ObjectId(args.id),
                userMessages.platformFailed,
            );
            return await this.orgAuth.asUserWithViewAccessOnPlatform(ctx, platform, () =>
                platform.toGQLType(),
            );
        },
        getPublicPlatforms: async (parent: any, args: any, ctx: CTX) =>
            await this.userAuth.asUser(ctx, async () =>
                (
                    await this.repoFactory(Platform).find({ _is_public: true })
                ).map((_) => _.toGQLType()),
            ),
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Platform: {
            tag_manager_account: async (parent: any, args: any, ctx: CTX) => {
                const tagManagerAccount = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.tag_manager_account_id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    tagManagerAccount.orgId,
                    async () => tagManagerAccount.toGQLType(),
                );
            },
            platform_revisions: async (parent: any, args: any, ctx: CTX) => {
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.platformFailed,
                );
                const platformRevisions = await this.repoFactory(PlatformRevision).find({
                    _platform_id: platform.id,
                });
                if (await this.orgAuth.isUserWithViewAccess(ctx, platform.orgId)) {
                    return platformRevisions.map((_) => _.toGQLType());
                } else {
                    return await this.orgAuth.asUserWithViewAccessOnPlatform(
                        ctx,
                        platform,
                        async () =>
                            platformRevisions
                                .filter((_) => _.isPublished)
                                .map((_) => _.toGQLType()),
                    );
                }
            },
        },
    };
}
