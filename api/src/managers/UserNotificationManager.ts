import Manager from '../abstractions/Manager';
import { inject, injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import UserNotification from '../mongo/models/UserNotification';
import TYPES from '../container/IOC.types';
import CTX from '../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import userMessages from '../errors/UserMessages';
import BaseEmail from '../backends/email/abstractions/BaseEmail';

@injectable()
export default class UserNotificationManager extends Manager<UserNotification> {
    @inject(TYPES.BackendEmail) private mailer!: BaseEmail;

    protected gqlSchema = gql`
        """
        @model
        \`User Notification\`s in the system.
        They are described with a type and an optional referred entity (via id).
        """
        type UserNotification {
            """
            \`User Notification\` ID
            """
            id: ID!
            """
            \`User Notification\` Type
            """
            type: String!
            """
            Whether the \`User Notification\` has been viewed
            """
            is_viewed: Boolean!
            """
            Optional referred entity id
            """
            entity_id: ID
        }

        input DismissNotificationInput {
            notification_id: ID!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=UserNotification
            Mark the current notification as viewed
            """
            dismissNotification(dismissNotificationInput: DismissNotificationInput!): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        dismissNotification: async (parent: any, args: any, ctx: CTX): Promise<boolean> => {
            const notificationId = new ObjectId(args.dismissNotificationInput.notification_id);
            return await this.userAuth.asUser(ctx, async (me) => {
                const notification = await this.repoFactory(UserNotification).findOneThrows(
                    {
                        _user_id: me.id,
                        _id: notificationId,
                    },
                    userMessages.notificationFailed,
                );
                notification.isViewed = true;
                await this.repoFactory(UserNotification).save(notification, me);
                return true;
            });
        },
    };
}
