import Manager from '../abstractions/Manager';
import { inject, injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import User from '../mongo/models/User';
import Hash from '../core/Hash';
import CTX from '../gql/ctx/CTX';
import Org from '../mongo/models/Org';
import { ObjectId } from 'mongodb';
import OrgRole from '../mongo/models/OrgRole';
import Invite from '../mongo/models/Invite';
import UserNotification from '../mongo/models/UserNotification';
import PasswordReset from '../mongo/models/PasswordReset';
import TYPES from '../container/IOC.types';
import GenericError from '../errors/GenericError';
import { authenticator } from 'otplib';
import OperationOwner from '../enums/OperationOwner';
import SignUpRequest from '../mongo/models/SignUpRequest';
import ValidationError from '../errors/ValidationError';
import got from 'got';
import SignUpType from '../enums/SignUpType';
import UserNotificationManager from './UserNotificationManager';
import App from '../mongo/models/tag/App';
import Environment from '../mongo/models/tag/Environment';
import userMessages from '../errors/UserMessages';
import GQLError from '../errors/GQLError';
import { createOrg } from '../utils/OrgUtils';
import {
    createSession,
    createSessionFromUser,
    generateNewSession,
    getTempSessionUser,
} from '../utils/SessionUtils';
import { createApp } from '../utils/AppUtils';
import TagManagerAccountRepo from '../mongo/repos/tag/TagManagerAccountRepo';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import { GQLType } from '../mongo/types/Types';
import UserRepo from '../mongo/repos/UserRepo';
import DataManagerAccountRepo from '../mongo/repos/data/DataManagerAccountRepo';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import { NotificationType } from '../enums/NotificationType';
import { AppType } from '../enums/AppType';
import BaseEmail from '../backends/email/abstractions/BaseEmail';
import { LogPriority } from '../enums/LogPriority';
import {
    getCommercialStorageProvider,
    getCommercialStorageProviderConfig,
} from '../utils/IngestEndpointEnvironmentUtils';

@injectable()
export default class UserManager extends Manager<User> {
    @inject(TYPES.BackendEmail) private readonly mailer!: BaseEmail;
    @inject(TYPES.UserNotificationManager) private notificationManager!: UserNotificationManager;

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
        The value returned the sign up is completed.
        """
        type UserSessionLink {
            """
            \`User\` ID
            """
            uid: String!
            """
            The \`Session\` token
            """
            token: String!
            """
            The target url after the signup process
            """
            url: String!
            """
            The id of the \`environment\` created during the signup
            """
            environment_id: String
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
            temp_access_code: String!
            email: String
            domain: String
            org_name: String
            password: String
            invite_id: String
            git_hub_user: String
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
            completeSignUp(completeSignUpInput: CompleteSignUpInput!): UserSessionLink!
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
                await this.repoFactory(User).save(me, 'SYSTEM', OperationOwner.SYSTEM);
                return me.apiToken;
            });
        },
        signUp: async (parent: any, args: any) => {
            if (!(await this.config.useSignup())) {
                throw new GenericError(userMessages.signupDisabled, LogPriority.ERROR, true);
            }

            if (!(await this.config.emailServerEnabled())) {
                throw new GenericError(userMessages.emailServerNotEnabled, LogPriority.ERROR, true);
            }

            if (args.signUpInput.temp_access_code !== (await this.config.getBetaAccessCode())) {
                throw new ValidationError('Invalid access code.', true);
            }

            const getEmail = async () => {
                if (args.signUpInput.invite_id !== undefined) {
                    const invite = await this.repoFactory(Invite).findByIdThrows(
                        new ObjectId(args.signUpInput.invite_id),
                        userMessages.inviteFailed,
                    );

                    return invite.email;
                } else {
                    //Check if email existing
                    const existingUser = await this.repoFactory(User).findOne({
                        _email: args.signUpInput.email,
                    });

                    if (existingUser !== null) {
                        throw new ValidationError(
                            userMessages.duplicateEmail(args.signUpInput.email),
                            true,
                        );
                    }

                    return args.signUpInput.email;
                }
            };

            const email = await getEmail();

            // Check if org name existing
            const orgName = args.signUpInput.org_name;

            if (orgName !== undefined && args.signUpInput.sign_up_type !== SignUpType.INVITE) {
                const existingOrg = await this.repoFactory(Org).findOne({
                    _name: orgName,
                });

                if (existingOrg !== null) {
                    throw new ValidationError(userMessages.duplicateOrg(orgName), true);
                }
            }

            const { body } = await got.post(
                `https://hcaptcha.com/siteverify?secret=${await this.config.getCaptchaSecret()}&response=${
                    args.signUpInput.captcha_token
                }`,
                {
                    responseType: 'json',
                },
            );

            const captchaSuccess = (body as { success: boolean }).success;
            const captchaScore = (body as { score: number }).score;

            if (!captchaSuccess || captchaScore < 0.5) {
                throw new ValidationError(userMessages.validationCAPTCHA, true);
            }

            const signUpRequest = await this.repoFactory(SignUpRequest).save(
                new SignUpRequest(
                    args.signUpInput.sign_up_type,
                    await this.config.getEncryptionSalt(),
                    args.signUpInput.full_name,
                    email,
                    args.signUpInput.domain,
                    args.signUpInput.org_name,
                    args.signUpInput.password,
                    args.signUpInput.git_hub_user,
                ),
                'SYSTEM',
                OperationOwner.SYSTEM,
            );

            const buildUrlType = () => {
                if (signUpRequest.sign_up_type === SignUpType.TAG_MANAGER) {
                    return 'tag-manager';
                }
                if (signUpRequest.sign_up_type === SignUpType.DATA_MANAGER) {
                    return 'data-manager';
                }
                return 'invite';
            };

            const buildCompleteSignUpLink = async () => {
                return `${await this.config.getUiUrl()}/account-prepare?type=${buildUrlType()}&token=${
                    signUpRequest.token
                }${
                    signUpRequest.sign_up_type === SignUpType.INVITE
                        ? `&target=${signUpRequest.org_name}`
                        : ''
                }`;
            };

            await this.mailer.sendEmail(
                email,
                `Thank you for registering for a Scale8 account!`,
                'VerificationEmail.twig',
                {
                    firstName: signUpRequest.first_name,
                    uiUrl: await buildCompleteSignUpLink(),
                },
            );

            return {
                email,
            };
        },
        completeSignUp: async (parent: any, args: any) => {
            if (!(await this.config.useSignup())) {
                throw new GenericError(userMessages.signupDisabled, LogPriority.ERROR, true);
            }

            if (!(await this.config.emailServerEnabled())) {
                throw new GenericError(userMessages.emailServerNotEnabled, LogPriority.ERROR, true);
            }

            const createWelcomeNotification = async (user: User): Promise<UserNotification> => {
                const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

                return repoFactory(UserNotification).save(
                    new UserNotification(user, NotificationType.WELCOME),
                    'SYSTEM',
                    OperationOwner.SYSTEM,
                );
            };

            // args.completeSignUpInput.sign_up_type

            const signUpRequest = await this.repoFactory(SignUpRequest).findOneThrows(
                {
                    _token: args.completeSignUpInput.token,
                },
                userMessages.userFailed,
            );

            //Check if email existing
            const existingUser = await this.repoFactory(User).findOne({
                _email: signUpRequest.email,
            });

            if (existingUser !== null) {
                return {
                    uid: '',
                    token: '',
                    url: '/login?reason=duplicate', //todo. no routes should be here.
                };
            }

            const generatedPassword: string = Hash.simpleRandomHash(9);

            const passwordHash: string =
                signUpRequest.password !== undefined
                    ? signUpRequest.password
                    : Hash.hashString(generatedPassword, await this.config.getEncryptionSalt());

            const buildNewUser = async () => {
                const user = new User(
                    signUpRequest.first_name,
                    signUpRequest.last_name,
                    passwordHash,
                    signUpRequest.email,
                    Hash.randomHash(await this.config.getEncryptionSalt()),
                    [],
                    true,
                );

                return this.repoFactory(User).save(user, 'SYSTEM', OperationOwner.SYSTEM);
            };

            const user = await buildNewUser();

            await createWelcomeNotification(user);

            const isTag = args.completeSignUpInput.sign_up_type === SignUpType.TAG_MANAGER;
            const isData = args.completeSignUpInput.sign_up_type === SignUpType.DATA_MANAGER;
            const isInvite = args.completeSignUpInput.sign_up_type === SignUpType.INVITE;

            const createNewOrg = async (): Promise<Org | null> => {
                if (isTag || isData) {
                    // Create Org
                    if (signUpRequest.org_name === undefined) {
                        throw new ValidationError(userMessages.validationOrgName, true);
                    }

                    return await createOrg(
                        user,
                        signUpRequest.org_name,
                        [user],
                        undefined,
                        undefined,
                        isTag,
                        isData,
                    );
                }
                return null;
            };

            const org = await createNewOrg();

            const createAppForUser = async (): Promise<App | null> => {
                if (isTag) {
                    if (signUpRequest.domain === undefined) {
                        throw new ValidationError(userMessages.validationAppDomain, true);
                    }
                    if (org === null) {
                        throw new ValidationError('Cannot find org', userMessages.orgFailed);
                    }
                    const tagManagerAccount = await this.repoFactory<TagManagerAccountRepo>(
                        TagManagerAccount,
                    ).getFromOrg(org);
                    // Create Org
                    if (signUpRequest.org_name === undefined) {
                        throw new ValidationError(userMessages.validationOrgName, true);
                    }

                    return createApp(
                        user,
                        tagManagerAccount,
                        signUpRequest.domain,
                        signUpRequest.domain,
                        AppType.WEB,
                        getCommercialStorageProvider(),
                        await getCommercialStorageProviderConfig(),
                        true,
                        true,
                    );
                }
                return null;
            };

            const app = await createAppForUser();

            await this.mailer.sendEmail(
                user.email,
                `Your sign up is complete!`,
                'SignUpRequestVerified.twig',
                {
                    firstName: user.firstName,
                    password: signUpRequest.password === undefined ? generatedPassword : undefined,
                    uiUrl: `${await this.config.getUiUrl()}/login`,
                },
            );

            await this.repoFactory(SignUpRequest).delete(
                signUpRequest,
                'SYSTEM',
                OperationOwner.SYSTEM,
            );

            const session = await createSessionFromUser(user);

            if (isInvite) {
                return {
                    uid: session.uid,
                    token: session.token,
                    url: '/s8/select-org', //todo. no routes should be here.
                };
            } else if (isTag) {
                if (app === null) {
                    throw new ValidationError('Cannot find app', userMessages.appFailed);
                }

                const getEnvironmentId = async () => {
                    const environments = await this.repoFactory(Environment).find({
                        _app_id: app.id,
                    });

                    if (environments.length > 0) {
                        return environments[0].id;
                    }
                    return null;
                };

                return {
                    uid: session.uid,
                    token: session.token,
                    url: `/s8/app/analytics?id=${app.id}&period=realtime`, //todo. no routes should be here.
                    environment_id: await getEnvironmentId(),
                    gitHubUser: signUpRequest.git_hub_user,
                };
            } else if (isData) {
                if (org === null) {
                    throw new ValidationError('Cannot find org', userMessages.orgFailed);
                }
                return {
                    uid: session.uid,
                    token: session.token,
                    url: `/s8/data-manager?id=${
                        (
                            await this.repoFactory<DataManagerAccountRepo>(
                                DataManagerAccount,
                            ).getFromOrg(org)
                        ).id
                    }`, //todo. no routes should be here.
                };
            } else {
                throw new ValidationError(userMessages.validationInvalidSignUp, true);
            }
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
                await this.repoFactory(User).save(me, 'SYSTEM', OperationOwner.SYSTEM);
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
                await this.repoFactory(User).save(me, 'SYSTEM', OperationOwner.SYSTEM);
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
                await this.repoFactory(User).save(user, 'SYSTEM', OperationOwner.SYSTEM);
                return true;
            });
        },
        removeGitHubLink: async (parent: any, args: any, ctx: CTX) => {
            return await this.userAuth.asUser(ctx, async (me) => {
                me.github = undefined;
                await this.repoFactory(User).save(me, 'SYSTEM', OperationOwner.SYSTEM);

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
                await this.repoFactory(User).save(me, 'SYSTEM', OperationOwner.SYSTEM);
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

                await this.repoFactory(User).save(me, 'SYSTEM', OperationOwner.SYSTEM);

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
                    OperationOwner.SYSTEM,
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
            await this.repoFactory(User).save(user, 'SYSTEM', OperationOwner.SYSTEM);
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
