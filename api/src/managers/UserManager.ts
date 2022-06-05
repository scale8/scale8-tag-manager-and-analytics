import Manager from '../abstractions/Manager';
import { inject, injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import User from '../mongo/models/User';
import Hash from '../core/Hash';
import CTX from '../gql/ctx/CTX';
import Org from '../mongo/models/Org';
import OrgRole from '../mongo/models/OrgRole';
import Invite from '../mongo/models/Invite';
import UserNotification from '../mongo/models/UserNotification';
import PasswordReset from '../mongo/models/PasswordReset';
import TYPES from '../container/IOC.types';
import GenericError from '../errors/GenericError';
import { authenticator } from 'otplib';
import UserNotificationManager from './UserNotificationManager';
import userMessages from '../errors/UserMessages';
import GQLError from '../errors/GQLError';
import { createSession, generateNewSession, getTempSessionUser } from '../utils/SessionUtils';
import { GQLType } from '../mongo/types/Types';
import UserRepo from '../mongo/repos/UserRepo';
import BaseEmail from '../backends/email/abstractions/BaseEmail';
import { LogPriority } from '../enums/LogPriority';

import SignUpService from '../signup/SignUpService';

@injectable()
export default class UserManager extends Manager<User> {
    @inject(TYPES.BackendEmail) private readonly mailer!: BaseEmail;
    @inject(TYPES.UserNotificationManager) private notificationManager!: UserNotificationManager;
    @inject(TYPES.SignUpService) private signUpService!: SignUpService;

    protected gqlSchema = gql`
        """
        @model
        Represents a \`User\` in the system.
        """
        type User {
            """
            \`User\` ID
            """
            id: ID!
            """
            \`User\`'s first name
            """
            first_name: String!
            """
            \`User\`'s last name
            """
            last_name: String!
            """
            \`User\`'s API token
            """
            api_token: String!
            """
            \`User\`'s GitHub username
            """
            github_user: String
            """
            Whether the \`User\` is connected with a GitHub account
            """
            github_connected: Boolean!
            """
            \`User\`'s email address
            """
            email: String!
            """
            List of \`Org\`s the \`User\` has access to
            """
            orgs(filters: [Filter]): [Org!]!
            """
            List of \`Invite\`s the \`User\` has sent
            """
            invites: [Invite!]!
            """
            List of \`Notification\`s for the \`User\`
            """
            user_notifications: [UserNotification!]!
            """
            Whether the \`User\` is an admin
            """
            is_admin: Boolean!
            """
            \`User\`'s two-factor auth enabled
            """
            two_factor_auth: Boolean!
            """
            \`User\`'s email notifications enabled
            """
            email_notifications: Boolean!
            """
            The date the \`User\` was created
            """
            created_at: DateTime!
            """
            The date the \`User\` was last updated
            """
            updated_at: DateTime!
        }

        """
        @model
        This type of session is returned after the login is completed.
        """
        type UserSession {
            """
            \`User\` ID
            """
            uid: String!
            """
            The \`Session\` token
            """
            token: String!
        }

        """
        @model
        DataManagerSignUpData
        """
        type DataManagerSignUpCompleted {
            data_manager_account_id: String!
        }

        """
        @model
        TagManagerSignUpData
        """
        type TagManagerSignUpCompleted {
            app_id: String!
            environment_id: String!
        }

        """
        @model
        The value returned the sign up is completed.
        """
        type SignUpCompleted {
            """
            \`User\` ID
            """
            uid: String!
            """
            The \`Session\` token
            """
            token: String!
            """
            True if the user is already existing
            """
            is_duplicate: Boolean
            """
            Data required for data manager
            """
            data_manager: DataManagerSignUpCompleted
            """
            Data required for tag manager
            """
            tag_manager: TagManagerSignUpCompleted
        }

        """
        @model
        The value returned after the sign up start.
        """
        type SignUpResult {
            """
            The email of the user signing up
            """
            email: String!
            """
            The request token used to skip email validation (invite)
            """
            request_token: String
        }

        """
        @model
        This type of session is returned after the first part of a 2-factor auth is completed.
        """
        type TempSession {
            """
            \`User\` ID
            """
            uid: String!
            """
            Temporary token to provide on next step of 2-factor auth (see Login2FAInput)
            """
            temp_token: String!
        }

        """
        @model
        Either session type (Temp/User) depending on the 2-factor auth settings.
        """
        union Session = TempSession | UserSession

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=User
            Get a the session user
            """
            me: User!
            """
            @bound=User
            Generate and get a new two factor secret
            """
            prepareTwoFactor: String!
        }

        input SignUpInput {
            sign_up_type: SignUpType!
            full_name: String!
            captcha_token: String!
            email: String
            domain: String
            org_name: String
            password: String
            invite_token: String
        }

        input CompleteSignUpInput {
            sign_up_type: SignUpType!
            token: String!
        }

        input LoginInput {
            """
            \`User\`'s Email
            """
            email: String!
            """
            \`User\`'s Password
            """
            password: String!
        }

        input Login2FAInput {
            """
            \`User\` ID
            """
            uid: String!
            """
            Temporary token for 2-factor auth (from TempSession)
            """
            temp_token: String!
            """
            2-factor auth code
            """
            code: String!
        }

        input TwoFactorAuthEnableInput {
            """
            2-factor auth code
            """
            code: String!
        }

        input TwoFactorAuthDisableInput {
            """
            2-factor auth code
            """
            code: String!
        }

        input SendPasswordResetInput {
            """
            \`User\`'s Email
            """
            email: String!
        }

        input ResetPasswordInput {
            """
            Reset Password Token (provided via email)
            """
            token: String!
            """
            New Password
            """
            new_password: String!
        }

        input MeUpdateInput {
            """
            If provided the \`Logged in User\` first name to update
            """
            first_name: String
            """
            If provided the \`Logged in User\` last name to update
            """
            last_name: String
            """
            If provided the \`Logged in User\` email to update
            """
            email: String
            """
            If provided the \`Logged in User\` email notifications setting to update
            """
            email_notifications: Boolean
        }

        input ChangePasswordInput {
            """
            \`Logged in User\` old password
            """
            old_password: String
            """
            \`Logged in User\` new password
            """
            new_password: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=User
            """
            signUp(signUpInput: SignUpInput!): SignUpResult!
            """
            @bound=User
            """
            completeSignUp(completeSignUpInput: CompleteSignUpInput!): SignUpCompleted!
            """
            @bound=User
            """
            login(login: LoginInput!): Session!
            """
            @bound=User
            """
            login2fa(login2faInput: Login2FAInput!): UserSession!
            """
            @bound=User
            Update currently logged \`User\`
            """
            updateMe(meUpdateInput: MeUpdateInput!): Boolean!
            """
            @bound=User
            Delete currently logged \`User\` (Account removal)
            """
            deleteMe: Boolean!
            """
            @bound=User
            Change currently logged \`User\`'s password
            """
            changePassword(changePasswordInput: ChangePasswordInput!): Boolean!
            """
            @bound=User
            Remove currently logged \`User\`'s link to GitHub
            """
            removeGitHubLink: Boolean!
            """
            @bound=User
            """
            sendPasswordResetEmail(sendPasswordResetInput: SendPasswordResetInput!): Boolean!
            """
            @bound=User
            """
            resetPassword(resetPasswordInput: ResetPasswordInput!): UserSession!
            """
            @bound=User
            """
            resetAPIToken: String!
            """
            @bound=User
            """
            enableTwoFactorAuth(twoFactorAuthEnableInput: TwoFactorAuthEnableInput!): Boolean!
            """
            @bound=User
            """
            disableTwoFactorAuth(twoFactorAuthDisableInput: TwoFactorAuthDisableInput!): Boolean!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        me: async (parent: any, args: any, ctx: CTX) =>
            this.userAuth.asUser(ctx, (me) => me.toGQLType()),
        prepareTwoFactor: async (parent: any, args: any, ctx: CTX) => {
            if (!(await this.config.twoFactorAuthEnabled())) {
                throw new GenericError(userMessages.twoFactorAuthDisabled, LogPriority.ERROR, true);
            }

            return await this.userAuth.asUser(ctx, async (me) => {
                if (me.twoFactorAuth) {
                    throw new GenericError(
                        userMessages.alreadyEnabledTwoFactor,
                        LogPriority.DEBUG,
                        true,
                    );
                }
                const secret = authenticator.generateSecret();
                me.twoFactorSecret = secret;
                await this.repoFactory(User).save(me, me);
                return secret;
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        User: {
            github_user: async (parent: any, args: any, ctx: CTX) => {
                return await this.userAuth.asUser(ctx, async (me) => {
                    return me.github?.username;
                });
            },
            github_connected: async (parent: any, args: any, ctx: CTX) => {
                return await this.userAuth.asUser(ctx, async (me) => {
                    return me.github !== undefined;
                });
            },
            invites: async (parent: any, args: any, ctx: CTX) => {
                return await this.userAuth.asUser(ctx, async (me) => {
                    return (
                        await this.repoFactory(Invite).find({
                            _email: me.email,
                        })
                    ).map((_) => _.toGQLType());
                });
            },
            user_notifications: async (parent: any, args: any, ctx: CTX) => {
                return await this.userAuth.asUser(ctx, async (me) => {
                    return (
                        await this.repoFactory(UserNotification).find({
                            _user_id: me.id,
                            _is_viewed: false,
                        })
                    ).map((_) => _.toGQLType());
                });
            },
            orgs: async (parent: any, args: any, ctx: CTX) => {
                return await this.userAuth.asUser(ctx, async (me) => {
                    const applyReturnFilters = (
                        filters: { prop_name: string; regex: string }[] | undefined,
                        output: GQLType,
                    ): boolean => {
                        if (filters === undefined || filters.length === 0) {
                            return true;
                        } else {
                            const filterMap: Map<string, string> = new Map(
                                filters.map((_) => [_.prop_name, _.regex]),
                            );
                            for (const k in output) {
                                if (output.hasOwnProperty(k)) {
                                    const regex = filterMap.get(k);
                                    if (regex !== undefined) {
                                        //we need to check regex on output[k]
                                        const value = output[k];
                                        if (typeof value !== 'string') {
                                            throw new GQLError(userMessages.unsupportedRegex, true);
                                        } else {
                                            if (value.match(regex) === null) {
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                            return true;
                        }
                    };

                    const myOrgs = await this.repoFactory<UserRepo>(User).getOrgs(me);
                    return myOrgs
                        .map((org) => org.toGQLType())
                        .filter((_) => applyReturnFilters(args.filters, _));
                });
            },
        },
        Session: {
            __resolveType: (obj: any) => {
                if (obj.temp_token !== undefined) {
                    return 'TempSession';
                } else if (obj.token !== undefined) {
                    return 'UserSession';
                }
                return null;
            },
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        resetAPIToken: async (parent: any, args: any, ctx: CTX) => {
            return await this.userAuth.asUser(ctx, async (me) => {
                me.resetAPIToken(await this.config.getEncryptionSalt());
                await this.repoFactory(User).save(me, 'SYSTEM');
                return me.apiToken;
            });
        },
        signUp: async (parent: any, args: any) => {
            return this.signUpService.prepareSignup({
                captchaToken: args.signUpInput.captcha_token,
                signUpType: args.signUpInput.sign_up_type,
                fullName: args.signUpInput.full_name,
                domain: args.signUpInput.domain,
                orgName: args.signUpInput.org_name,
                password: args.signUpInput.password,
                requestEmail: args.signUpInput.email,
                inviteToken: args.signUpInput.invite_token,
            });
        },

        completeSignUp: async (
            parent: any,
            args: any,
        ): Promise<{
            uid: string;
            token: string;
            is_duplicate?: boolean;
            data_manager?: {
                data_manager_account_id: string;
            };
            tag_manager?: {
                app_id: string;
                environment_id: string;
            };
        }> => {
            return this.signUpService.completeSignUp(
                args.completeSignUpInput.token,
                args.completeSignUpInput.sign_up_type,
            );
        },
        login: async (parent: any, args: any) => {
            const session = await createSession(args.login.email, args.login.password);
            if (session.isTemp) {
                return {
                    uid: session.uid,
                    temp_token: session.token,
                };
            } else {
                return {
                    uid: session.uid,
                    token: session.token,
                };
            }
        },
        login2fa: async (parent: any, args: any) => {
            if (!(await this.config.twoFactorAuthEnabled())) {
                throw new GenericError(userMessages.twoFactorAuthDisabled, LogPriority.ERROR, true);
            }

            const user = await getTempSessionUser(
                args.login2faInput.uid,
                args.login2faInput.temp_token,
            );
            if (
                !user.twoFactorAuth ||
                user.twoFactorSecret === undefined ||
                !authenticator.check(args.login2faInput.code, user.twoFactorSecret)
            ) {
                throw new GenericError(userMessages.invalidTwoFactorCode, LogPriority.DEBUG, true);
            }
            const session = await generateNewSession(user);
            return {
                uid: session.uid,
                token: session.token,
            };
        },
        enableTwoFactorAuth: async (parent: any, args: any, ctx: CTX) => {
            if (!(await this.config.twoFactorAuthEnabled())) {
                throw new GenericError(userMessages.twoFactorAuthDisabled, LogPriority.ERROR, true);
            }

            return await this.userAuth.asUser(ctx, async (me) => {
                if (
                    me.twoFactorSecret === undefined ||
                    !authenticator.check(args.twoFactorAuthEnableInput.code, me.twoFactorSecret)
                ) {
                    throw new GenericError(
                        userMessages.invalidTwoFactorCode,
                        LogPriority.DEBUG,
                        true,
                    );
                }
                me.twoFactorAuth = true;
                await this.repoFactory(User).save(me, 'SYSTEM');
                return true;
            });
        },
        disableTwoFactorAuth: async (parent: any, args: any, ctx: CTX) => {
            if (!(await this.config.twoFactorAuthEnabled())) {
                throw new GenericError(userMessages.twoFactorAuthDisabled, LogPriority.ERROR, true);
            }

            return await this.userAuth.asUser(ctx, async (me) => {
                if (
                    me.twoFactorSecret === undefined ||
                    !authenticator.check(args.twoFactorAuthDisableInput.code, me.twoFactorSecret)
                ) {
                    throw new GenericError(
                        userMessages.invalidTwoFactorCode,
                        LogPriority.DEBUG,
                        true,
                    );
                }
                me.twoFactorAuth = false;
                await this.repoFactory(User).save(me, 'SYSTEM');
                return true;
            });
        },
        changePassword: async (parent: any, args: any, ctx: CTX) => {
            return await this.userAuth.asUser(ctx, async (me) => {
                const user = await this.repo.findOneThrows(
                    {
                        _email: me.email,
                        _password: Hash.hashString(
                            args.changePasswordInput.old_password,
                            await this.config.getEncryptionSalt(),
                        ),
                    },
                    userMessages.userFailed,
                );
                user.setPassword(
                    args.changePasswordInput.new_password,
                    await this.config.getEncryptionSalt(),
                );
                await this.repoFactory(User).save(user, 'SYSTEM');
                return true;
            });
        },
        removeGitHubLink: async (parent: any, args: any, ctx: CTX) => {
            return await this.userAuth.asUser(ctx, async (me) => {
                me.github = undefined;
                await this.repoFactory(User).save(me, 'SYSTEM');

                return true;
            });
        },
        updateMe: async (parent: any, args: any, ctx: CTX) => {
            return await this.userAuth.asUser(ctx, async (me) => {
                if (args.meUpdateInput.hasOwnProperty('email')) {
                    const user = await this.repoFactory(User).findOne({
                        _email: args.meUpdateInput.email,
                    });
                    if (user !== null && user.id.toString() !== me.id.toString()) {
                        throw new GenericError(
                            'This email is already assigned to another user',
                            LogPriority.DEBUG,
                            userMessages.accountFailed,
                        );
                    }
                }
                me.bulkGQLSet(args.meUpdateInput);
                await this.repoFactory(User).save(me, 'SYSTEM');
                return true;
            });
        },
        deleteMe: async (parent: any, args: any, ctx: CTX) => {
            return await this.userAuth.asUser(ctx, async (me) => {
                const myOrgs = await this.repoFactory<UserRepo>(User).getOrgs(me);

                // Avoid owner removal
                myOrgs.forEach((org: Org) => {
                    if (org.orgOwnerUser.equals(me.id)) {
                        throw new GQLError(userMessages.noOwnerDelete, true);
                    }
                });

                // Remove user from all organizations
                await Promise.all(
                    myOrgs.map(async (org: Org) => {
                        const role = await this.repoFactory(OrgRole).findOne({
                            _user_id: me.id,
                            _org_id: org.id,
                        });
                        if (role !== null) {
                            await this.repoFactory(OrgRole).delete(role, me);
                        }

                        return;
                    }),
                );

                // Make the email available again
                me.email = `${me.email} ${Hash.simpleRandomHash(9)}`;

                // Remove github link
                me.github = undefined;

                await this.repoFactory(User).save(me, 'SYSTEM');

                await this.repoFactory(User).delete(me, me);
                return true;
            });
        },
        sendPasswordResetEmail: async (parent: any, args: any) => {
            if (!(await this.config.emailServerEnabled())) {
                throw new GenericError(userMessages.emailServerNotEnabled, LogPriority.ERROR, true);
            }

            const email = args.sendPasswordResetInput.email;
            //this has to fail in silent for obvious reasons, so...
            try {
                const user = await this.repoFactory(User).findOneThrows(
                    {
                        _email: email,
                    },
                    userMessages.userFailed,
                );
                const reset = await this.repoFactory(PasswordReset).save(
                    new PasswordReset(user),
                    'SYSTEM',
                );
                //send email...
                await this.mailer.sendEmail(user.email, 'Password Reset', 'PasswordReset.twig', {
                    firstName: user.firstName,
                    uiUrl: `${await this.config.getUiUrl()}/reset-password?token=${reset.token}`,
                });
            } catch (e: any) {
                await this.logger.logError(e, `Failed to send password reset email to ${email}`);
            }
            return true;
        },
        resetPassword: async (parent: any, args: any) => {
            if (!(await this.config.emailServerEnabled())) {
                throw new GenericError(userMessages.emailServerNotEnabled, LogPriority.ERROR, true);
            }

            const token = args.resetPasswordInput.token;
            const passwordReset = await this.repoFactory(PasswordReset).findOneThrows(
                {
                    _token: token,
                },
                userMessages.userFailed,
            );
            const user = await this.repoFactory(User).findByIdThrows(
                passwordReset.userId,
                userMessages.userFailed,
            );
            user.setPassword(
                args.resetPasswordInput.new_password,
                await this.config.getEncryptionSalt(),
            );
            user.twoFactorAuth = false;
            await this.repoFactory(User).save(user, 'SYSTEM');
            //send email
            await this.mailer.sendEmail(user.email, 'Password Changed', 'PasswordChanged.twig', {
                firstName: user.firstName,
                uiUrl: `${await this.config.getUiUrl()}/login`,
            });
            const session = await generateNewSession(user);
            return {
                uid: session.uid,
                token: session.token,
            };
        },
    };
}
