import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import PlatformEvent from '../../mongo/models/tag/PlatformEvent';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import Platform from '../../mongo/models/tag/Platform';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import userMessages from '../../errors/UserMessages';

@injectable()
export default class PlatformEventManager extends Manager<PlatformEvent> {
    protected gqlSchema = gql`
        """
        @model
        """
        type PlatformEvent {
            """
            ID of the \`PlatformEvent\`
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
            \`Platform\` that contains this \`PlatformEvent\`
            """
            platform: Platform!
            """
            \`PlatformRevision\` that contains this \`PlatformEvent\`
            """
            platform_revision: PlatformRevision!
            """
            Name of the \`PlatformEvent\`
            """
            name: String!
            """
            Description of the \`PlatformEvent\`
            """
            description: String!
            """
            Event that is being used
            """
            event: String!
            """
            List of \`PlatformDataMap\`s that create a document style key => value map. This can be directly accessed by the event when called.
            """
            platform_data_maps: [PlatformDataMap!]!
        }

        input PlatformEventInput {
            """
            The persistence id associated with this \`PlatformEvent\`. This ID should be unique to the action, however it can be shared across \`PlatformRevision\`s. We will provide a difference between two \`PlatformRevision\`s when they have the same persistence id.
            """
            persistence_id: String!
            """
            The name of the new \`PlatformEvent\` being created.
            """
            name: String!
            """
            The description of the new \`PlatformEvent\` being created.
            """
            description: String!
            """
            Optional Icon
            """
            icon: TypeIcon
            """
            The name of the event being used by the new \`PlatformEvent\`.
            """
            event: String!
            """
            A list of action settings described as \`PlatformDataMap\`s that create a document style container of key => value pairs
            """
            platform_data_maps: [PlatformDataMapInput!]
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=PlatformEvent
            Method will return a \`PlatformEvent\` instance from its ID.
            """
            getPlatformEvent(id: ID!): PlatformEvent!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getPlatformEvent: async (parent: any, args: any, ctx: CTX) => {
            const platformEvent = await this.repoFactory(PlatformEvent).findByIdThrows(
                new ObjectId(args.id),
                userMessages.eventFailed,
            );
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                platformEvent.platformRevisionId,
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                ctx,
                platformRevision,
                () => platformEvent.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        PlatformEvent: {
            platform: async (parent: any, args: any, ctx: CTX) => {
                const platformEvent = await this.repoFactory(PlatformEvent).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.eventFailed,
                );
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    platformEvent.platformId,
                    userMessages.platformFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatform(ctx, platform, () =>
                    platform.toGQLType(),
                );
            },
            platform_revision: async (parent: any, args: any, ctx: CTX) => {
                const platformEvent = await this.repoFactory(PlatformEvent).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.eventFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformEvent.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    () => platformRevision.toGQLType(),
                );
            },
            platform_data_maps: async (parent: any, args: any, ctx: CTX) => {
                const platformEvent = await this.repoFactory(PlatformEvent).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.eventFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformEvent.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () =>
                        (
                            await this.repoFactory(PlatformDataMap).findByIds(
                                platformEvent.platformDataMapIds,
                            )
                        ).map((_) => _.toGQLType()),
                );
            },
        },
    };
}
