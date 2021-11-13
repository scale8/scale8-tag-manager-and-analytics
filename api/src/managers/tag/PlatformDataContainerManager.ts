import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import PlatformDataContainer from '../../mongo/models/tag/PlatformDataContainer';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import Platform from '../../mongo/models/tag/Platform';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import userMessages from '../../errors/UserMessages';

@injectable()
export default class PlatformDataContainerManager extends Manager<PlatformDataContainer> {
    protected gqlSchema = gql`
        """
        @model
        """
        type PlatformDataContainer {
            """
            ID of the \`PlatformDataContainer\`
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
            \`Platform\` that contains this \`PlatformDataContainer\`
            """
            platform: Platform!
            """
            \`PlatformRevision\` that contains this \`PlatformDataContainer\`
            """
            platform_revision: PlatformRevision!
            """
            Name of the \`PlatformDataContainer\`
            """
            name: String!
            """
            Description of the \`PlatformDataContainer\`
            """
            description: String!
            """
            Whether or not to allow custom keys to be defined by the user to access properties within this data layer
            """
            allow_custom: Boolean!
            """
            A list of \`PlatformDataMap\` that describe the document style structure of this data layer
            """
            platform_data_maps: [PlatformDataMap!]!
        }

        input PlatformDataContainerInput {
            """
            The persistence id associated with this \`PlatformDataContainer\`. This ID should be unique to the action, however it can be shared across \`PlatformRevision\`s. We will provide a difference between two \`PlatformRevision\`s when they have the same persistence id.
            """
            persistence_id: String!
            """
            The name of the new \`PlatformDataContainer\` being created.
            """
            name: String!
            """
            Description
            """
            description: String = "A description has not been provided"
            """
            Optional Icon
            """
            icon: TypeIcon
            """
            Whether or not to enable user defined keys to access key => value pairs that have not been explicity mapped
            """
            allow_custom: Boolean
            """
            A list of key => value pairs described as \`PlatformDataMap\`s.
            """
            platform_data_maps: [PlatformDataMapInput!]
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=PlatformDataContainer
            Method will return a \`PlatformDataContainer\` instance from its ID.
            """
            getPlatformDataContainer(id: ID!): PlatformDataContainer!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getPlatformDataContainer: async (parent: any, args: any, ctx: CTX) => {
            const platformDataContainer = await this.repoFactory(
                PlatformDataContainer,
            ).findByIdThrows(new ObjectId(args.id), userMessages.dataMapFailed);
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                platformDataContainer.platformRevisionId,
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                ctx,
                platformRevision,
                () => platformDataContainer.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        PlatformDataContainer: {
            platform: async (parent: any, args: any, ctx: CTX) => {
                const platformDataContainer = await this.repoFactory(
                    PlatformDataContainer,
                ).findByIdThrows(new ObjectId(parent.id), userMessages.dataMapFailed);
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    platformDataContainer.platformId,
                    userMessages.platformFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatform(ctx, platform, () =>
                    platform.toGQLType(),
                );
            },
            platform_revision: async (parent: any, args: any, ctx: CTX) => {
                const platformDataContainer = await this.repoFactory(
                    PlatformDataContainer,
                ).findByIdThrows(new ObjectId(parent.id), userMessages.dataMapFailed);
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataContainer.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    () => platformRevision.toGQLType(),
                );
            },
            platform_data_maps: async (parent: any, args: any, ctx: CTX) => {
                const platformDataContainer = await this.repoFactory(
                    PlatformDataContainer,
                ).findByIdThrows(new ObjectId(parent.id), userMessages.dataMapFailed);
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataContainer.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () =>
                        (
                            await this.repoFactory(PlatformDataMap).findByIds(
                                platformDataContainer.platformDataMapIds,
                            )
                        ).map((_) => _.toGQLType()),
                );
            },
        },
    };
}
