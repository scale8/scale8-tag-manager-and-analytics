import Manager from '../abstractions/Manager';
import { inject, injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import Org from '../mongo/models/Org';
import User from '../mongo/models/User';
import CTX from '../gql/ctx/CTX';
import OrgRole from '../mongo/models/OrgRole';
import PermissionGroup from '../mongo/models/PermissionGroup';
import { ObjectId } from 'mongodb';
import TYPES from '../container/IOC.types';
import UserManager from './UserManager';
import Invite from '../mongo/models/Invite';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import GenericError from '../errors/GenericError';
import GQLMethod from '../enums/GQLMethod';
import GQLError from '../errors/GQLError';
import userMessages from '../errors/UserMessages';
import { createOrg, fetchOrg, findUserAvailableByEmail, isUserInOrg } from '../utils/OrgUtils';
import TagManagerAccountRepo from '../mongo/repos/tag/TagManagerAccountRepo';
import DataManagerAccountRepo from '../mongo/repos/data/DataManagerAccountRepo';
import StripeService from '../payments/providers/StripeService';
import UserRepo from '../mongo/repos/UserRepo';
import BaseEmail from '../backends/email/abstractions/BaseEmail';
import { LogPriority } from '../enums/LogPriority';
import Hash from '../core/Hash';
import AccountService from '../accounts/AccountService';
import OrgService from '../orgs/OrgService';
import DataError from '../errors/DataError';

@injectable()
export default class OrgManager extends Manager<Org> {
    @inject(TYPES.UserManager) private userManager!: UserManager;
    @inject(TYPES.BackendEmail) private mailer!: BaseEmail;
    @inject(TYPES.StripeService) protected readonly stripeService!: StripeService;
    @inject(TYPES.AccountService) protected readonly accountService!: AccountService;
    @inject(TYPES.OrgService) protected readonly orgService!: OrgService;

    protected gqlSchema = gql`
        """
        @model
        The granular permission associated with an \`OrgUser\`
        """
        type OrgUserPermissions {
            """
            \`Org\` user is able to view the org entities
            """
            can_view: Boolean!
            """
            \`Org\` user is able to create new entities
            """
            can_create: Boolean!
            """
            \`Org\` user is able to edit entities
            """
            can_edit: Boolean!
            """
            \`Org\` user is able to delete entities
            """
            can_delete: Boolean!
            """
            \`Org\` user has admin level access
            """
            is_admin: Boolean!
        }
        """
        @model
        An \`OrgUser\` is a limited representation of User and is linked to an \`Org\`
        """
        type OrgUser {
            """
            \`OrgUser\` ID
            """
            id: ID!
            """
            \`OrgUser\`'s first name
            """
            first_name: String!
            """
            \`OrgUser\`'s last name
            """
            last_name: String!
            """
            \`OrgUser\`'s email address
            """
            email: String!
            """
            \`OrgUser\`'s two-factor auth enabled
            """
            two_factor_auth: Boolean!
            """
            \`OrgUser\`'s permissions as described in \`OrgUserPermissions\`
            """
            permissions: OrgUserPermissions!
            """
            The date the \`OrgUser\` was created
            """
            created_at: DateTime!
            """
            The date the \`OrgUser\` was last updated
            """
            updated_at: DateTime!
            """
            If the \`OrgUser\` currently has ownership of this \`Org\`. Ownership is required to manage billing, upgrades, downgrades and termination of an Org.
            """
            owner: Boolean!
        }
        """
        @model
        An \`Org\` is the top level of abstraction.
        A set of \`OrgUser\`'s are associated with an \`Org\` and each of these \`OrgUser\`'s can have granular access permissions associated with them.
        Depending on your \`User\`, your may be limited to the number of \`Org\`'s you are able to create.
        """
        type Org {
            """
            A unique \`Org\` ID
            """
            id: ID!
            """
            Name used to describe the \`Org\`
            """
            name: String!
            """
            A valid timezone
            """
            tz: TimeZone!
            """
            A \`TagManagerAccount\` associated with this \`Org\`. A Scale8 Tag Manager account might not exist yet unless a trial has been requested or product has been subscribed to.
            """
            tag_manager_account: TagManagerAccount!
            """
            A \`DataManagerAccount\` associated with this \`Org\`. A Scale8 Data Manager account might not exist yet unless a trial has been requested or product has been subscribed to.
            """
            data_manager_account: DataManagerAccount!
            """
            List of \`OrgUser\`'s associated with this \`Org\`
            """
            users: [OrgUser!]!
            """
            \`OrgUser\` representation of current \`User\`
            """
            me: OrgUser!
            """
            List of \`Invite\`'s associated with this \`Org\`
            """
            invites: [Invite!]!
            """
            DateTime the \`Org\` was created
            """
            created_at: DateTime!
            """
            DateTime the \`Org\` was last updated
            """
            updated_at: DateTime!
            """
            If this org is subscribed to any of the Scale8 services
            """
            is_paid: Boolean!
            """
            If this org has a stripeCustomerId and can use the costumer portal
            """
            has_billing: Boolean!
            """
            If the org is under manual invoicing
            """
            manual_invoicing: Boolean!
            """
            The billing cycle start
            """
            billing_start: DateTime
            """
            The billing cycle end
            """
            billing_end: DateTime
        }

        input OrgPermissionGroupInput {
            """
            Grants permission to view \`Org\` entities.
            """
            can_view: Boolean!
            """
            Grants permission to create \`Org\` entities
            """
            can_create: Boolean!
            """
            Grants permission to update \`Org\` entities
            """
            can_edit: Boolean!
            """
            Grants permission to delete \`Org\` entities
            """
            can_delete: Boolean!
            """
            Grants full admin access on an \`Org\`.
            """
            is_admin: Boolean!
        }

        input OrgCreateInput {
            """
            Name of the new \`Org\` being created
            """
            name: String!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input OrgUpdateInput {
            """
            The ID of the \`Org\` being updated
            """
            id: ID!
            """
            If provided the \`Org\` name to update
            """
            name: String
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input OrgDeleteInput {
            """
            The ID of the \`Org\` being deleted
            """
            id: ID!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input RegenerateUserPasswordInput {
            """
            The ID of the \`Org\` that hold the target user
            """
            org_id: ID!
            """
            The ID of the target \`User\`
            """
            user_id: ID!
        }

        input OrgAddUserInput {
            """
            The ID of the \`Org\` for which the user is being created
            """
            org_id: ID!
            """
            The Email of the \`User\` being added to this \`Org\`
            """
            email: String!
            """
            The Name of the \`User\` being added to this \`Org\`
            """
            first_name: String!
            """
            The Surname of the \`User\` being added to this \`Org\`
            """
            last_name: String!
            """
            A set of \`Org\` permissions which will be granted to the \`User\`
            """
            org_permission_group: OrgPermissionGroupInput!
        }

        input AdminAddMeToOrgInput {
            """
            The ID of the \`Org\` that the admin will join
            """
            org_id: ID!
        }

        input OrgInviteUserInput {
            """
            The ID of the \`Org\` for which the invited is being created
            """
            org_id: ID!
            """
            The Email of the \`User\` being invited to this \`Org\`
            """
            email: String!
            """
            A set of \`Org\` permissions which will be granted to the \`User\`
            """
            org_permission_group: OrgPermissionGroupInput!
        }

        input OrgCancelInviteInput {
            """
            The ID of the \`Invite\` being cancelled
            """
            invite_id: ID!
            """
            The ID of the \`Org\` for which the invite was created
            """
            org_id: ID!
        }

        input OrgAcceptInviteInput {
            """
            The ID of the \`Invite\` being accepted
            """
            invite_id: ID!
        }

        input OrgDeclineInviteInput {
            """
            The ID of the \`Invite\` being cancelled
            """
            invite_id: ID!
        }

        input OrgUpdateUserInput {
            """
            The \`Org\` ID that the \`User\` is connected to
            """
            org_id: ID!
            """
            The \`User\` ID of the connected user
            """
            user_id: ID!
            """
            A new set of \`User\` permissions that will replace the existing permission set
            """
            permission_group: OrgPermissionGroupInput!
        }

        input OrgRemoveUserInput {
            """
            The \`Org\` ID that the \`User\` is connected to
            """
            org_id: ID!
            """
            The \`User\` ID of the connected user
            """
            user_id: ID!
        }

        input OrgRemoveMeInput {
            """
            The \`Org\` ID that the currently logged \`User\` is connected to
            """
            org_id: ID!
        }

        input TransferOwnershipInput {
            """
            The \`Org\` ID of the Organization whose ownership will be transferred
            """
            org_id: ID!
            """
            The \`User\` ID of the recipient of the ownership transfer
            """
            user_id: ID!
        }

        input StartTagManagerTrialInput {
            """
            The \`Org\` ID for which the new Tag Manager account will be created under
            """
            org_id: ID!
        }

        input StartDataManagerTrialInput {
            """
            The \`Org\` ID for which the new Data Manager account will be created under
            """
            org_id: ID!
        }

        input BillingPortalInput {
            """
            The \`Org\` ID
            """
            org_id: ID!
            """
            Return URL
            """
            return_url: String!
        }

        input CreateFirstOrgInput {
            """
            Name of new Org
            """
            org_name: String!
            """
            First name of Org owner
            """
            first_name: String!
            """
            Last name of Org owner
            """
            last_name: String!
            """
            Email of Org owner
            """
            email: String!
            """
            Password of Org owner
            """
            password: String!
        }

        input AccountSubscribeInput {
            org_id: ID!
            product_id: String!
            success_url: String!
            cancel_url: String!
            product: AccountProduct
        }

        input AccountUnsubscribeInput {
            org_id: ID!
            product: AccountProduct
        }

        input SwitchToManualInvoicingInput {
            org_id: ID!
        }

        input AlignSubscriptionInput {
            org_id: ID!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Org
            This endpoint is only enabled to configure the first org.
            """
            createFirstOrg(createFirstOrgInput: CreateFirstOrgInput): Org!
            """
            @bound=Org
            Start Tag Manager Trial
            """
            startTagManagerTrial(
                startTagManagerTrialInput: StartTagManagerTrialInput
            ): TagManagerAccount!
            """
            @bound=Org
            Start Data Manager Trial
            """
            startDataManagerTrial(
                startDataManagerTrialInput: StartDataManagerTrialInput
            ): DataManagerAccount!
            """
            @bound=Org
            Add a user to an \`Org\`
            """
            regenerateUserPassword(
                regenerateUserPasswordInput: RegenerateUserPasswordInput!
            ): String!
            """
            @bound=Org
            Add a user to an \`Org\`
            """
            addUser(orgAddUserInput: OrgAddUserInput!): User!
            """
            @bound=Org
            A system admin can add himself to an \`Org\`, in order to offer support
            """
            adminAddMeToOrg(adminAddMeToOrgInput: AdminAddMeToOrgInput!): Boolean!
            """
            @bound=Org
            Invite a user to join an \`Org\`
            """
            inviteUser(orgInviteUserInput: OrgInviteUserInput!): Boolean!
            """
            @bound=Org
            Cancel a user invite to join an \`Org\`
            """
            cancelInvite(orgCancelInviteInput: OrgCancelInviteInput!): Boolean!
            """
            @bound=Org
            Accept a user invite to join an \`Org\`
            """
            acceptInvite(orgAcceptInviteInput: OrgAcceptInviteInput!): Boolean!
            """
            @bound=Org
            Decline a user invite to join an \`Org\`
            """
            declineInvite(orgDeclineInviteInput: OrgDeclineInviteInput!): Boolean!
            """
            @bound=Org
            Remove a \`User\` from an \`Org\`.
            """
            removeUser(orgRemoveUserInput: OrgRemoveUserInput!): Boolean!
            """
            @bound=Org
            Remove currently logged \`User\` from an \`Org\`.
            """
            removeMe(orgRemoveMeInput: OrgRemoveMeInput!): Boolean!
            """
            @bound=Org
            Transfer the \`Org\` ownership to a target \`User\`.
            """
            transferOwnership(transferOwnershipInput: TransferOwnershipInput!): Boolean!
            """
            @bound=Org
            Update a \`User\`'s permissions against an \`Org\`
            """
            updateUserPermissions(orgUpdateUserInput: OrgUpdateUserInput!): Boolean!
            """
            @bound=Org
            Create a new \`Org\`
            """
            createOrg(orgCreateInput: OrgCreateInput!): Org!
            """
            @bound=Org
            Update an existing \`Org\`
            """
            updateOrg(orgUpdateInput: OrgUpdateInput!): Boolean!
            """
            @bound=Org
            Delete an \`Org\` and all child entities
            """
            deleteOrg(orgDeleteInput: OrgDeleteInput!): Boolean!
            """
            @bound=Org
            Billing portal
            """
            getBillingPortalUrl(billingPortalInput: BillingPortalInput): String!
            """
            @bound=Org
            Subscribe To TagManager

            This will generate a new link that the user can follow to checkout if
            it has no subscription yet, it will return null otherwise.
            """
            accountSubscribe(accountSubscribeInput: AccountSubscribeInput): String
            """
            @bound=Org
            Cancel subscription
            """
            accountUnsubscribe(accountUnsubscribeInput: AccountUnsubscribeInput): Boolean!
            """
            @bound=Org
            Switch to manual invoicing (admin only)
            """
            switchToManualInvoicing(
                switchToManualInvoicingInput: SwitchToManualInvoicingInput
            ): Boolean!
            """
            @bound=Org
            Aligns the accounts and org details to the payment method subscription.
            """
            alignSubscription(alignSubscriptionInput: AlignSubscriptionInput): Org!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Org
            This function will return a list of all \`Org\`s, available only if the user is an admin.
            """
            getOrgs: [Org!]!
            """
            @bound=Org
            Given a valid \`Org\` ID, this function will return an \`Org\` provided the API \`User\` has been granted at least **view** access.
            """
            getOrg(
                """
                Any valid \`Org\` ID
                """
                id: ID!
            ): Org!
            """
            @bound=Org
            Given a valid \`Org\` ID and the ID of an \`User\` connected to the org it will return the permissions for that \`User\`
            """
            getOrgUserPermissions(
                """
                Any valid \`Org\` ID
                """
                orgId: ID!
                """
                The ID of an \`User\` connected to the org
                """
                userId: ID!
            ): OrgUserPermissions!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getOrgs: async (parent: any, args: any, ctx: CTX) => {
            return await this.userAuth.asAdminUser(ctx, async () => {
                const orgs = await this.repoFactory(Org).find({});
                return orgs.map((org) => org.toGQLType());
            });
        },
        getOrg: async (parent: any, args: any, ctx: CTX) => {
            const orgId = new ObjectId(args.id);
            return await this.orgAuth.asUserWithViewAccess(ctx, orgId, async () =>
                (await fetchOrg(orgId)).toGQLType(),
            );
        },
        getOrgUserPermissions: async (parent: any, args: any, ctx: CTX) => {
            return await this.getUserPermissionsGql(
                ctx,
                new ObjectId(args.orgId),
                new ObjectId(args.userId),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        OrgUser: {
            permissions: async (parent: any, args: any, ctx: CTX) => {
                return await this.getUserPermissionsGql(
                    ctx,
                    new ObjectId(parent.org_id),
                    new ObjectId(parent.id),
                );
            },
        },
        Org: {
            me: async (parent: any, args: any, ctx: CTX) => {
                const org = await fetchOrg(new ObjectId(parent.id));
                return this.orgAuth.asUserWithViewAccess(ctx, org.id, async (me) => ({
                    id: me.id,
                    org_id: org.id,
                    first_name: me.firstName,
                    last_name: me.lastName,
                    two_factor_auth: me.twoFactorAuth,
                    email: me.email,
                    created_at: me.created_at,
                    updated_at: me.updated_at,
                    owner: org.orgOwnerUser.equals(me.id),
                }));
            },
            tag_manager_account: async (parent: any, args: any, ctx: CTX) => {
                const org = await fetchOrg(new ObjectId(parent.id));
                return this.orgAuth.asUserWithViewAccess(ctx, org.id, async () => {
                    const account = await this.repoFactory<TagManagerAccountRepo>(
                        TagManagerAccount,
                    ).getFromOrg(org);

                    return account.toGQLType();
                });
            },
            data_manager_account: async (parent: any, args: any, ctx: CTX) => {
                const org = await fetchOrg(new ObjectId(parent.id));
                return this.orgAuth.asUserWithViewAccess(ctx, org.id, async () => {
                    const account = await this.repoFactory<DataManagerAccountRepo>(
                        DataManagerAccount,
                    ).getFromOrg(org);

                    return account.toGQLType();
                });
            },
            users: async (parent: any, args: any, ctx: CTX) => {
                const orgId: ObjectId = new ObjectId(parent.id);
                return await this.orgAuth.asUserWithViewAccess(ctx, orgId, async () => {
                    const roles = await this.repoFactory(OrgRole).find({
                        _org_id: orgId,
                    });
                    return Promise.all(
                        (await this.repoFactory(User).findByIds(roles.map((_) => _.userId))).map(
                            (_) => this.repoFactory<UserRepo>(User).convertToOrgUser(_, orgId),
                        ),
                    );
                });
            },
            invites: async (parent: any, args: any, ctx: CTX) => {
                const org = await fetchOrg(new ObjectId(parent.id));
                return this.orgAuth.asUserWithViewAccess(ctx, org.id, async () =>
                    (
                        await this.repoFactory(Invite).find({
                            _org_id: org.id,
                        })
                    ).map((_) => _.toGQLType()),
                );
            },
            is_paid: async (parent: any, args: any, ctx: CTX) => {
                const org = await fetchOrg(new ObjectId(parent.id));
                const stripeSubscriptionId = await this.stripeService.getStripeSubscriptionId(org);
                return this.orgAuth.asUserWithViewAccess(
                    ctx,
                    org.id,
                    () => typeof stripeSubscriptionId === 'string',
                );
            },
            has_billing: async (parent: any, args: any, ctx: CTX) => {
                const org = await fetchOrg(new ObjectId(parent.id));
                return this.orgAuth.asUserWithViewAccess(
                    ctx,
                    org.id,
                    () => typeof org.stripeCustomerId === 'string',
                );
            },
        },
    };

    // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createFirstOrg: async (parent: any, args: any, ctx: CTX) => {
            if (this.config.isCommercial()) {
                throw new GQLError('Operation is not allowed in the commercial version', true);
            } else if ((await this.repoFactory(Org).count({})) > 1) {
                throw new GQLError('It looks like everything has been configured already', true);
            } else {
                const data = args.createFirstOrgInput;
                const newUser = await this.repoFactory(User).save(
                    new User(
                        data.first_name,
                        data.last_name,
                        Hash.hashString(data.password, await this.config.getEncryptionSalt()),
                        data.email,
                        Hash.randomHash(await this.config.getEncryptionSalt()),
                        [],
                        true,
                    ),
                    'SYSTEM',
                );
                return (
                    await createOrg(
                        newUser,
                        data.org_name,
                        [newUser],
                        undefined,
                        undefined,
                        false,
                        false,
                        true,
                    )
                ).toGQLType();
            }
        },
        startTagManagerTrial: async (parent: any, args: any, ctx: CTX) => {
            throw new GQLError(
                'We are no longer supporting new signups. We have a new version of the platform coming soon.',
                true,
            );
            // const org = await fetchOrg(new ObjectId(args.startTagManagerTrialInput.org_id));
            // return await this.orgAuth.asUserWithOrgOwnership(ctx, org, async (me) => {
            //     const account = await this.repoFactory<TagManagerAccountRepo>(
            //         TagManagerAccount,
            //     ).getFromOrg(org);
            //     account.enabled = true;
            //     account.startTrial();
            //     await this.repoFactory(TagManagerAccount).save(account, me, {
            //         gqlMethod: GQLMethod.CREATE,
            //     });
            //     return account.toGQLType();
            // });
        },
        startDataManagerTrial: async (parent: any, args: any, ctx: CTX) => {
            throw new GQLError(
                'We are no longer supporting new signups. We have a new version of the platform coming soon.',
                true,
            );
            /*
                Logic for creating a data manager account = same as tag manager account
             */
            // const org = await fetchOrg(new ObjectId(args.startDataManagerTrialInput.org_id));
            // return await this.orgAuth.asUserWithOrgOwnership(ctx, org, async (me) => {
            //     const account = await this.repoFactory<DataManagerAccountRepo>(
            //         DataManagerAccount,
            //     ).getFromOrg(org);
            //     account.enabled = true;
            //     account.startTrial();
            //     await this.repoFactory(DataManagerAccount).save(account, me, {
            //         gqlMethod: GQLMethod.CREATE,
            //     });
            //     return account.toGQLType();
            // });
        },
        regenerateUserPassword: async (parent: any, args: any, ctx: CTX) => {
            const orgId = new ObjectId(args.regenerateUserPasswordInput.org_id);
            const userId = new ObjectId(args.regenerateUserPasswordInput.user_id);
            return await this.orgAuth.asUserWithOrgAdmin(ctx, orgId, async (me) => {
                const user = await this.repoFactory(User).findByIdThrows(
                    userId,
                    userMessages.userFailed,
                );
                if (!(await isUserInOrg(me, orgId))) {
                    throw new GenericError(userMessages.userNotIncluded, LogPriority.DEBUG, true);
                }
                const newPassword = Hash.simpleRandomHash(9);
                user.setPassword(newPassword, await this.config.getEncryptionSalt());
                await this.repoFactory(User).save(user, me);
                return newPassword;
            });
        },
        addUser: async (parent: any, args: any, ctx: CTX) => {
            const data = args.orgAddUserInput;
            const orgId = new ObjectId(data.org_id);
            return await this.orgAuth.asUserWithOrgAdmin(ctx, orgId, async (me) => {
                const org = await fetchOrg(orgId);
                const orgPermissionGroup = args.orgAddUserInput.org_permission_group;
                const findOrCreateUser = async () => {
                    const user = await findUserAvailableByEmail(data.email, org.id);

                    return user !== null
                        ? user
                        : this.repoFactory(User).save(
                              new User(
                                  data.first_name,
                                  data.last_name,
                                  Hash.randomHash(await this.config.getEncryptionSalt()),
                                  data.email,
                                  Hash.randomHash(await this.config.getEncryptionSalt()),
                              ),
                              me,
                          );
                };

                const user = await findOrCreateUser();

                await this.repoFactory<UserRepo>(User).linkToOrg(
                    me,
                    user,
                    org,
                    new PermissionGroup(
                        orgPermissionGroup.can_view,
                        orgPermissionGroup.can_create,
                        orgPermissionGroup.can_edit,
                        orgPermissionGroup.can_delete,
                        orgPermissionGroup.is_admin,
                    ),
                );

                return user;
            });
        },
        adminAddMeToOrg: async (parent: any, args: any, ctx: CTX) => {
            const org = await fetchOrg(new ObjectId(args.adminAddMeToOrgInput.org_id));

            return await this.userAuth.asAdminUser(ctx, async (me) => {
                if (await isUserInOrg(me, org.id)) {
                    throw new GenericError(
                        userMessages.userAlreadyIncluded,
                        LogPriority.DEBUG,
                        true,
                    );
                }
                await this.repoFactory<UserRepo>(User).linkToOrg(
                    me,
                    me,
                    org,
                    new PermissionGroup(true, true, true, true, true),
                );
                return true;
            });
        },
        inviteUser: async (parent: any, args: any, ctx: CTX) => {
            if (!(await this.config.useSignup())) {
                throw new GenericError(userMessages.cannotInvite, LogPriority.ERROR, true);
            }
            if (!(await this.config.emailServerEnabled())) {
                throw new GenericError(userMessages.emailServerNotEnabled, LogPriority.ERROR, true);
            }
            const orgId = new ObjectId(args.orgInviteUserInput.org_id);
            const email = args.orgInviteUserInput.email;
            return await this.orgAuth.asUserWithOrgAdmin(ctx, orgId, async (me) => {
                const org = await fetchOrg(orgId);
                const orgPermissionGroup = args.orgInviteUserInput.org_permission_group;

                await findUserAvailableByEmail(email, org.id);

                const existingInvite = await this.repoFactory(Invite).findOne({
                    _email: email,
                    _org_id: org.id,
                });

                if (existingInvite !== null) {
                    throw new GenericError(
                        userMessages.userAlreadyInvited,
                        LogPriority.DEBUG,
                        true,
                    );
                }

                const invite = await this.repoFactory(Invite).save(
                    new Invite(
                        email,
                        org.id,
                        new PermissionGroup(
                            orgPermissionGroup.can_view,
                            orgPermissionGroup.can_create,
                            orgPermissionGroup.can_edit,
                            orgPermissionGroup.can_delete,
                            orgPermissionGroup.is_admin,
                        ),
                    ),
                    me,
                );

                //Check if email existing
                const existingUser = await this.repoFactory(User).findOne({
                    _email: email,
                });

                if (existingUser !== null) {
                    await this.mailer.sendEmail(
                        invite.email,
                        `You have been invited to join ${org.name}`,
                        'InviteEmailExisting.twig',
                        {
                            orgName: org.name,
                            uiUrl: `${await this.config.getUiUrl()}/login`,
                        },
                    );
                    return true;
                } else {
                    await this.mailer.sendEmail(
                        invite.email,
                        `You have been invited to join ${org.name}`,
                        'InviteEmail.twig',
                        {
                            orgName: org.name,
                            uiUrl: `${await this.config.getUiUrl()}/sign-up?type=invite&target=${encodeURI(
                                org.name,
                            )}&invite_token=${invite.token}`,
                        },
                    );
                    return true;
                }
            });
        },
        cancelInvite: async (parent: any, args: any, ctx: CTX) => {
            const invite = await this.repoFactory(Invite).findByIdThrows(
                new ObjectId(args.orgCancelInviteInput.invite_id),
                userMessages.inviteFailed,
            );
            return await this.orgAuth.asUserWithOrgAdmin(ctx, invite.orgId, async (me) => {
                await this.repoFactory(Invite).hardDelete(invite, me);
                return true;
            });
        },
        acceptInvite: async (parent: any, args: any, ctx: CTX) => {
            const inviteId = new ObjectId(args.orgAcceptInviteInput.invite_id);
            return await this.userAuth.asUser(ctx, async (me) => {
                const invite = await this.repoFactory(Invite).findOneThrows(
                    {
                        _email: me.email,
                        _id: inviteId,
                    },
                    userMessages.inviteFailed,
                );
                const org = await fetchOrg(invite.orgId);
                //todo. complex case. TDB. for now, make this a system action... (what if the inviting user is deleted, then who performs the invite action?)
                await this.repoFactory<UserRepo>(User).linkToOrg(
                    'SYSTEM',
                    me,
                    org,
                    invite.orgPermissionGroup,
                );
                await this.repoFactory(Invite).hardDelete(invite, me);
                return true;
            });
        },
        declineInvite: async (parent: any, args: any, ctx: CTX) => {
            const inviteId = new ObjectId(args.orgDeclineInviteInput.invite_id);
            return await this.userAuth.asUser(ctx, async (me) => {
                const invite = await this.repoFactory(Invite).findOneThrows(
                    {
                        _email: me.email,
                        _id: inviteId,
                    },
                    userMessages.inviteFailed,
                );
                await this.repoFactory(Invite).hardDelete(invite, me);
                return true;
            });
        },
        updateUserPermissions: async (parent: any, args: any, ctx: CTX) => {
            const org = await fetchOrg(new ObjectId(args.orgUpdateUserInput.org_id));
            const updateUserId = new ObjectId(args.orgUpdateUserInput.user_id);
            return await this.orgAuth.asUserWithOrgAdmin(ctx, org.id, async (me) => {
                if (org.orgOwnerUser.equals(updateUserId)) {
                    throw new GQLError(userMessages.noOwnerPermission, true);
                } else {
                    const permissionGroup = args.orgUpdateUserInput.permission_group;
                    const role = await this.repoFactory(OrgRole).findOneThrows(
                        {
                            _user_id: updateUserId,
                            _org_id: org.id,
                        },
                        userMessages.userFailed,
                    );
                    role.permissionGroup = new PermissionGroup(
                        permissionGroup.can_view,
                        permissionGroup.can_create,
                        permissionGroup.can_edit,
                        permissionGroup.can_delete,
                        permissionGroup.is_admin,
                    );
                    await this.repoFactory(OrgRole).save(role, me);
                    return true;
                }
            });
        },
        removeUser: async (parent: any, args: any, ctx: CTX) => {
            const org = await fetchOrg(new ObjectId(args.orgRemoveUserInput.org_id));
            const removeUserId = new ObjectId(args.orgRemoveUserInput.user_id);
            return await this.orgAuth.asUserWithOrgAdmin(ctx, org.id, async (me) => {
                if (org.orgOwnerUser.equals(removeUserId)) {
                    throw new GQLError(userMessages.noOwnerRemove, true);
                } else {
                    const role = await this.repoFactory(OrgRole).findOneThrows(
                        {
                            _user_id: removeUserId,
                            _org_id: org.id,
                        },
                        userMessages.userFailed,
                    );
                    await this.repoFactory(OrgRole).delete(role, me);
                    return true;
                }
            });
        },
        removeMe: async (parent: any, args: any, ctx: CTX) => {
            const org = await fetchOrg(new ObjectId(args.orgRemoveMeInput.org_id));
            return await this.userAuth.asUser(ctx, async (me) => {
                if (org.orgOwnerUser.equals(me.id)) {
                    throw new GQLError(userMessages.noOwnerRemove, true);
                } else {
                    const role = await this.repoFactory(OrgRole).findOneThrows(
                        {
                            _user_id: me.id,
                            _org_id: org.id,
                        },
                        userMessages.userFailed,
                    );
                    await this.repoFactory(OrgRole).delete(role, me);
                    return true;
                }
            });
        },
        transferOwnership: async (parent: any, args: any, ctx: CTX) => {
            const org = await fetchOrg(new ObjectId(args.transferOwnershipInput.org_id));
            const targetUserId = new ObjectId(args.transferOwnershipInput.user_id);
            return await this.orgAuth.asUserWithOrgAdmin(ctx, org.id, async (me) => {
                if (org.orgOwnerUser.equals(me.id)) {
                    // check the recipient is an organization admin
                    const orgRole = await this.repoFactory(OrgRole).findOneThrows(
                        {
                            _user_id: targetUserId,
                            _org_id: org.id,
                        },
                        userMessages.noAdminInOwnershipTransfer,
                    );

                    if (!orgRole.permissionGroup.isAdmin) {
                        throw new GQLError(userMessages.noAdminInOwnershipTransfer, true);
                    }

                    org.orgOwnerUser = targetUserId;
                    await this.repoFactory(Org).save(org, me);
                    return true;
                } else {
                    throw new GQLError(userMessages.noOwner, true);
                }
            });
        },
        createOrg: async (parent: any, args: any, ctx: CTX) => {
            if (this.config.isCommercial()) {
                throw new GQLError(
                    'We are no longer allowing new Orgs from being created. We have a new version of the platform coming soon.',
                    true,
                );
            } else {
                return await this.orgAuth.asUserWithOrgManagement(ctx, async (me) => {
                    if (
                        (await this.repoFactory(Org).count({
                            _org_owner_user_id: me.id,
                        })) >= (await this.config.getMaxOrgs())
                    ) {
                        throw new DataError(userMessages.maxOrgs, true);
                    }
                    return (
                        await createOrg(
                            me,
                            args.orgCreateInput.name,
                            [me],
                            undefined,
                            args.orgCreateInput.comments,
                        )
                    ).toGQLType();
                });
            }
        },
        updateOrg: async (parent: any, args: any, ctx: CTX) => {
            const orgId = new ObjectId(args.orgUpdateInput.id);
            return await this.orgAuth.asUserWithEditAccess(ctx, orgId, async (me) => {
                const org = await fetchOrg(orgId);
                org.bulkGQLSet(args.orgUpdateInput, ['name']);
                await this.repoFactory(Org).save(org, me, {
                    gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                    userComments: args.orgUpdateInput.comments,
                });
                return true;
            });
        },
        deleteOrg: async (parent: any, args: any, ctx: CTX) => {
            const org = await fetchOrg(new ObjectId(args.orgDeleteInput.id));
            return await this.orgAuth.asUserWithOrgOwnership(ctx, org, async (me) => {
                await this.repoFactory(Org).delete(
                    org,
                    me,
                    GQLMethod.DELETE,
                    args.orgDeleteInput.comments,
                );
                return true;
            });
        },
        getBillingPortalUrl: async (parent: any, args: any, ctx: CTX) => {
            const data = args.billingPortalInput;
            const org = await fetchOrg(new ObjectId(data.org_id));
            return await this.orgAuth.asUserWithOrgOwnership(
                ctx,
                org,
                async () => await this.stripeService.getBillingPortalUrl(org, data.return_url),
            );
        },
        accountSubscribe: async (parent: any, args: any, ctx: CTX) => {
            const data = args.accountSubscribeInput;
            /*
                User must be the Org owner as this involves billing changes...
                There must be no subscription existing at the org level. This must be the first entry (e.g. the creation of a subscription)
                Account must be in active or require payment state and not connected to a subscription yet
           */
            const org = await fetchOrg(new ObjectId(data.org_id));
            return await this.orgAuth.asUserWithOrgOwnership(ctx, org, async () => {
                return this.accountService.subscribeToAccount(
                    org,
                    await this.accountService.getAccountByProduct(org, data.product),
                    data.product_id,
                    data.success_url,
                    data.cancel_url,
                );
            });
        },
        accountUnsubscribe: async (parent: any, args: any, ctx: CTX) => {
            const data = args.accountUnsubscribeInput;
            const org = await fetchOrg(new ObjectId(data.org_id));
            return await this.orgAuth.asUserWithOrgOwnership(ctx, org, async () => {
                //force a double check here...
                return this.accountService.unsubscribeAccount(
                    org,
                    await this.accountService.getAccountByProduct(org, data.product),
                );
            });
        },
        switchToManualInvoicing: async (parent: any, args: any, ctx: CTX) => {
            const org = await fetchOrg(new ObjectId(args.switchToManualInvoicingInput.org_id));
            return await this.userAuth.asAdminUser(ctx, async (me) => {
                await this.orgService.switchToManualInvoicing(org, me);
                return true;
            });
        },
        alignSubscription: async (parent: any, args: any, ctx: CTX) => {
            const data = args.alignSubscriptionInput;
            const org = await fetchOrg(new ObjectId(data.org_id));
            return await this.orgAuth.asUserWithViewAccess(ctx, org.id, async () => {
                // Update subscription data
                await this.stripeService.updateOrgSubscriptionData(org);

                return (await this.orgService.alignSubscription(org)).toGQLType();
            });
        },
    };

    private async getUserPermissionsGql(ctx: CTX, orgId: ObjectId, userId: ObjectId) {
        return this.orgAuth.asUserWithViewAccess(ctx, orgId, async () => {
            const role = await this.repoFactory(OrgRole).findOneThrows(
                {
                    _user_id: userId,
                    _org_id: orgId,
                },
                userMessages.userFailed,
            );
            return role.permissionGroup.toGQLType();
        });
    }
}
