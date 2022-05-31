import { inject, injectable } from 'inversify';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import GenericError from '../errors/GenericError';
import userMessages from '../errors/UserMessages';
import { LogPriority } from '../enums/LogPriority';
import User from '../mongo/models/User';
import ValidationError from '../errors/ValidationError';
import Org from '../mongo/models/Org';
import got from 'got';
import BaseEmail from '../backends/email/abstractions/BaseEmail';
import { SignupPayload } from '../Types';
import SignUpRequest from '../mongo/models/SignUpRequest';
import SignUpType from '../enums/SignUpType';
import Invite from '../mongo/models/Invite';
import UserNotification from '../mongo/models/UserNotification';
import container from '../container/IOC.config';
import { NotificationType } from '../enums/NotificationType';
import Hash from '../core/Hash';
import { createOrg, fetchOrg } from '../utils/OrgUtils';
import App from '../mongo/models/tag/App';
import TagManagerAccountRepo from '../mongo/repos/tag/TagManagerAccountRepo';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import { createApp } from '../utils/AppUtils';
import { AppType } from '../enums/AppType';
import {
    getCommercialStorageProvider,
    getCommercialStorageProviderConfig,
} from '../utils/IngestEndpointEnvironmentUtils';
import { createSessionFromUser } from '../utils/SessionUtils';
import UserRepo from '../mongo/repos/UserRepo';
import Environment from '../mongo/models/tag/Environment';
import DataManagerAccountRepo from '../mongo/repos/data/DataManagerAccountRepo';
import DataManagerAccount from '../mongo/models/data/DataManagerAccount';

@injectable()
export default class SignUpService {
    @inject(TYPES.RepoFromModelFactory) private readonly repoFactory!: RepoFromModelFactory;
    @inject(TYPES.BackendLogger) private readonly logger!: BaseLogger;
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;
    @inject(TYPES.BackendEmail) private readonly mailer!: BaseEmail;

    private async checkSignUpEnabled(): Promise<void> {
        if (!(await this.config.useSignup())) {
            throw new GenericError(userMessages.signupDisabled, LogPriority.ERROR, true);
        }

        if (!(await this.config.emailServerEnabled())) {
            throw new GenericError(userMessages.emailServerNotEnabled, LogPriority.ERROR, true);
        }
    }

    private async checkEmailExisting(email: string): Promise<void> {
        const existingUser = await this.repoFactory(User).findOne({
            _email: email,
        });

        if (existingUser !== null) {
            throw new ValidationError(userMessages.duplicateEmail(email), true);
        }
    }

    private async checkOrgExisting(orgName: string | undefined): Promise<void> {
        if (orgName !== undefined) {
            const existingOrg = await this.repoFactory(Org).findOne({
                _name: orgName,
            });

            if (existingOrg !== null) {
                throw new ValidationError(userMessages.duplicateOrg(orgName), true);
            }
        }
    }

    private async checkCaptcha(captchaToken: string): Promise<void> {
        const { body } = await got.post(
            `https://hcaptcha.com/siteverify?secret=${await this.config.getCaptchaSecret()}&response=${captchaToken}`,
            {
                responseType: 'json',
            },
        );

        const captchaSuccess = (body as { success: boolean }).success;
        const captchaScore = (body as { score: number }).score;

        if (!captchaSuccess || captchaScore < 0.5) {
            throw new ValidationError(userMessages.validationCAPTCHA, true);
        }
    }

    private async buildSignupRequest(
        email: string,
        signupProps: SignupPayload,
    ): Promise<SignUpRequest> {
        const { signUpType, fullName, domain, orgName, password, inviteToken } = signupProps;

        return this.repoFactory(SignUpRequest).save(
            new SignUpRequest(
                signUpType,
                await this.config.getEncryptionSalt(),
                fullName,
                email,
                domain,
                orgName,
                password,
                inviteToken,
            ),
            'SYSTEM',
        );
    }

    private async sendValidationEmail(signUpRequest: SignUpRequest): Promise<void> {
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
            }`;
        };

        await this.mailer.sendEmail(
            signUpRequest.email,
            `Thank you for registering for a Scale8 account!`,
            'VerificationEmail.twig',
            {
                firstName: signUpRequest.first_name,
                uiUrl: await buildCompleteSignUpLink(),
            },
        );
    }

    private static async createWelcomeNotification(user: User): Promise<UserNotification> {
        const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

        return repoFactory(UserNotification).save(
            new UserNotification(user, NotificationType.WELCOME),
            'SYSTEM',
        );
    }

    private async userAlreadyInSystem(signUpRequest: SignUpRequest): Promise<boolean> {
        const existingUser = await this.repoFactory(User).findOne({
            _email: signUpRequest.email,
        });
        return existingUser !== null;
    }

    private async buildNewUser(
        signUpRequest: SignUpRequest,
        generatedPassword: string,
    ): Promise<User> {
        const passwordHash: string =
            signUpRequest.password !== undefined
                ? signUpRequest.password
                : Hash.hashString(generatedPassword, await this.config.getEncryptionSalt());

        const user = await this.repoFactory(User).save(
            new User(
                signUpRequest.first_name,
                signUpRequest.last_name,
                passwordHash,
                signUpRequest.email,
                Hash.randomHash(await this.config.getEncryptionSalt()),
                [],
                true,
            ),
            'SYSTEM',
        );

        await SignUpService.createWelcomeNotification(user);

        return user;
    }

    private static async createNewOrg(
        signUpType: SignUpType,
        signUpRequest: SignUpRequest,
        user: User,
    ): Promise<Org> {
        if (signUpRequest.org_name === undefined) {
            throw new ValidationError(userMessages.validationOrgName, true);
        }

        return await createOrg(
            user,
            signUpRequest.org_name,
            [user],
            undefined,
            undefined,
            signUpType === SignUpType.TAG_MANAGER,
            signUpType === SignUpType.DATA_MANAGER,
        );
    }

    private async createNewApp(signUpRequest: SignUpRequest, user: User, org: Org): Promise<App> {
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

    private async sendSignUpCompleteEmail(
        signUpRequest: SignUpRequest,
        user: User,
        generatedPassword: string,
    ): Promise<void> {
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
    }

    private async deleteSignupRequest(signUpRequest: SignUpRequest): Promise<void> {
        await this.repoFactory(SignUpRequest).delete(signUpRequest, 'SYSTEM');
    }

    private async acceptInvite(signUpRequest: SignUpRequest, user: User): Promise<void> {
        if (signUpRequest.invite_token !== undefined) {
            const invite = await this.repoFactory(Invite).findOneThrows(
                {
                    _token: signUpRequest.invite_token,
                },
                userMessages.inviteFailed,
            );

            const org = await fetchOrg(invite.orgId);
            await this.repoFactory<UserRepo>(User).linkToOrg(
                'SYSTEM',
                user,
                org,
                invite.orgPermissionGroup,
            );
            await this.repoFactory(Invite).hardDelete(invite, user);
        }
    }

    public async prepareSignup(signupProps: SignupPayload) {
        const { captchaToken, signUpType, orgName, requestEmail, inviteToken } = signupProps;

        await this.checkSignUpEnabled();

        await this.checkCaptcha(captchaToken);

        if (signUpType === SignUpType.INVITE) {
            if (inviteToken === undefined) {
                throw new ValidationError(userMessages.inviteFailed, true);
            }
            const invite = await this.repoFactory(Invite).findOneThrows(
                {
                    _token: inviteToken,
                },
                userMessages.inviteInvalid,
            );

            await this.checkEmailExisting(invite.email);

            const signUpRequest = await this.buildSignupRequest(invite.email, signupProps);

            return {
                email: signUpRequest.email,
                request_token: signUpRequest.token,
            };
        } else {
            if (requestEmail === undefined) {
                throw new ValidationError(userMessages.genericError, true);
            }
            await this.checkEmailExisting(requestEmail);

            await this.checkOrgExisting(orgName);

            const signUpRequest = await this.buildSignupRequest(requestEmail, signupProps);

            await this.sendValidationEmail(signUpRequest);

            return {
                email: signUpRequest.email,
            };
        }
    }

    public async completeSignUp(token: string, signUpType: SignUpType) {
        await this.checkSignUpEnabled();

        const signUpRequest = await this.repoFactory(SignUpRequest).findOneThrows(
            {
                _token: token,
            },
            userMessages.userFailed,
        );

        if (await this.userAlreadyInSystem(signUpRequest)) {
            return {
                uid: '',
                token: '',
                is_duplicate: true,
            };
        }

        const generatedPassword: string = Hash.simpleRandomHash(9);

        const isTag = signUpType === SignUpType.TAG_MANAGER;
        const isData = signUpType === SignUpType.DATA_MANAGER;
        const isInvite = signUpType === SignUpType.INVITE;

        if (isInvite) {
            const user = await this.buildNewUser(signUpRequest, generatedPassword);
            await this.acceptInvite(signUpRequest, user);
            await this.sendSignUpCompleteEmail(signUpRequest, user, generatedPassword);
            await this.deleteSignupRequest(signUpRequest);
            const session = await createSessionFromUser(user);
            return {
                uid: session.uid,
                token: session.token,
            };
        } else if (isTag) {
            const user = await this.buildNewUser(signUpRequest, generatedPassword);
            const org = await SignUpService.createNewOrg(signUpType, signUpRequest, user);
            const app = await this.createNewApp(signUpRequest, user, org);

            const getEnvironmentId = async () => {
                const environments = await this.repoFactory(Environment).find({
                    _app_id: app.id,
                });

                if (environments.length > 0) {
                    return environments[0].id.toString();
                } else {
                    throw new ValidationError('Cannot find environment', userMessages.envFailed);
                }
            };

            await this.sendSignUpCompleteEmail(signUpRequest, user, generatedPassword);
            await this.deleteSignupRequest(signUpRequest);
            const session = await createSessionFromUser(user);

            return {
                uid: session.uid,
                token: session.token,
                tag_manager: {
                    app_id: app.id.toString(),
                    environment_id: await getEnvironmentId(),
                },
            };
        } else if (isData) {
            const user = await this.buildNewUser(signUpRequest, generatedPassword);
            const org = await SignUpService.createNewOrg(signUpType, signUpRequest, user);

            await this.sendSignUpCompleteEmail(signUpRequest, user, generatedPassword);
            await this.deleteSignupRequest(signUpRequest);
            const session = await createSessionFromUser(user);

            return {
                uid: session.uid,
                token: session.token,
                data_manager: {
                    data_manager_account_id: (
                        await this.repoFactory<DataManagerAccountRepo>(
                            DataManagerAccount,
                        ).getFromOrg(org)
                    ).id.toString(),
                },
            };
        } else {
            throw new ValidationError(userMessages.validationInvalidSignUp, true);
        }
    }
}
