import Manager from '../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import Invite from '../mongo/models/Invite';
import CTX from '../gql/ctx/CTX';
import { ObjectID } from 'mongodb';
import userMessages from '../errors/UserMessages';
import { fetchOrg } from '../utils/OrgUtils';

@injectable()
export default class InviteManager extends Manager<Invite> {
    protected gqlSchema = gql`
        """
        @model
        \`Invite\` is used to manage the user invites to a join an organization.
        """
        type Invite {
            """
            Unique \`Invite\` id for this operation
            """
            id: ID!
            """
            The \`Org\` the user is invited to join
            """
            org: Org!
            """
            The email of the user invited
            """
            email: String!
            """
            The permissions the user wil have on the org once joined
            """
            org_permissions: OrgUserPermissions!
            """
            The date the \`Invite\` was created
            """
            created_at: DateTime!
            """
            DateTime the \`Invite\` was last updated
            """
            updated_at: DateTime!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Invite: {
            org: async (parent: any, args: any, ctx: CTX) => {
                const inviteId = new ObjectID(parent.id);
                //if they have been invited to join the Org, they must at minimum be offered view access.
                //while still not linked, they should be able to explore the org (top level only).
                return await this.userAuth.asUser(ctx, async () => {
                    const invite = await this.repoFactory(Invite).findOneThrows(
                        {
                            _id: inviteId,
                        },
                        userMessages.inviteFailed,
                    );
                    return (await fetchOrg(invite.orgId)).toGQLType();
                });
            },
            org_permissions: async (parent: any, args: any, ctx: CTX) => {
                const inviteId = new ObjectID(parent.id);
                return await this.userAuth.asUser(ctx, async () => {
                    const invite = await this.repoFactory(Invite).findOneThrows(
                        {
                            _id: inviteId,
                        },
                        userMessages.inviteFailed,
                    );
                    return invite.orgPermissionGroup.toGQLType();
                });
            },
        },
    };
}
