import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import Session from './Session';
import Hash from '../../core/Hash';
import GitHub from './GitHub';
import SessionRepo from '../repos/SessionRepo';
import GitHubRepo from '../repos/GitHubRepo';

export default class User extends Model {
    @Field<string>({
        required: true,
        exposeToGQLAs: 'first_name',
        validation: (value) => value.match(/.+/) !== null,
    })
    private _first_name: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'last_name',
        validation: (value) => value.match(/.+/) !== null,
    })
    private _last_name: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'email',
        validation: (value) => value.match(/.+@.+/) !== null,
    })
    private _email: string;

    @Field<string>({
        required: false,
        exposeToGQLAs: 'github_user',
        validation: (value) => value.match(/.+/) !== null,
    })
    private _github_user?: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'api_token',
    })
    private _api_token!: string;

    @Field<string>({
        required: true,
    })
    private _password!: string;

    @Field<string>({
        required: false,
    })
    private _two_factor_secret?: string;

    @Field<GitHub>({
        repository: GitHubRepo,
    })
    private _github?: GitHub;

    @Field<Session[]>({
        repository: SessionRepo,
        required: true,
    })
    private _sessions: Session[] = [];

    @Field<Session[]>({
        repository: SessionRepo,
        required: true,
    })
    private _temp_sessions: Session[] = [];

    @Field<Date>({
        required: true,
        defaultValue: () => new Date(),
        onUpdate: () => new Date(), //regardless of value, change on save
    })
    private _last_login?: Date;

    @Field<boolean>({
        required: true,
        defaultValue: () => false,
    })
    private _can_manage_orgs = false;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_admin',
    })
    private _is_admin = false;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'two_factor_auth',
    })
    private _two_factor_auth = false;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'email_notifications',
    })
    private _email_notifications = false;

    @Field<boolean>({
        required: true,
    })
    private _is_email_verified = false;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'can_create_tag_manager_trial',
    })
    private _can_create_tag_manager_trial: boolean;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'can_create_data_manager_trial',
    })
    private _can_create_data_manager_trial: boolean;

    constructor(
        firstName: string,
        lastName: string,
        passwordHash: string,
        email: string,
        apiToken: string,
        sessions: Session[] = [],
        canManageOrgs = false,
        isAdmin = false,
        emailNotifications = false,
        tempSessions: Session[] = [],
        canCreateTagManagerTrial = true,
        canCreateDataManagerTrial = true,
    ) {
        super();
        this._first_name = firstName;
        this._last_name = lastName;
        this._password = passwordHash;
        this._email = email;
        this._api_token = apiToken;
        this._sessions = sessions;
        this._temp_sessions = tempSessions;
        this._can_manage_orgs = canManageOrgs;
        this._is_admin = isAdmin;
        this._email_notifications = emailNotifications;
        this._is_email_verified = false;
        this._can_create_tag_manager_trial = canCreateTagManagerTrial;
        this._can_create_data_manager_trial = canCreateDataManagerTrial;
    }

    public resetAPIToken(salt: string): void {
        this._api_token = Hash.randomHash(salt);
    }

    get firstName(): string {
        return this._first_name;
    }

    set firstName(value: string) {
        this._first_name = value;
    }

    get lastName(): string {
        return this._last_name;
    }

    set lastName(value: string) {
        this._last_name = value;
    }

    get password(): string {
        return this._password;
    }

    setPassword(value: string, salt: string) {
        this._password = Hash.hashString(value, salt);
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get apiToken(): string {
        return this._api_token;
    }

    get github_user(): string | undefined {
        return this._github_user;
    }

    set github_user(value: string | undefined) {
        this._github_user = value;
    }

    get github(): GitHub | undefined {
        return this._github;
    }

    set github(value: GitHub | undefined) {
        this._github = value;
    }

    get sessions(): Session[] {
        return this._sessions;
    }

    set sessions(value: Session[]) {
        this._sessions = value;
    }

    get tempSessions(): Session[] {
        return this._temp_sessions;
    }

    set tempSessions(value: Session[]) {
        this._temp_sessions = value;
    }

    get twoFactorSecret(): string | undefined {
        return this._two_factor_secret;
    }

    set twoFactorSecret(value: string | undefined) {
        this._two_factor_secret = value;
    }

    get lastLogin(): Date | undefined {
        return this._last_login;
    }

    set lastLogin(value: Date | undefined) {
        this._last_login = value;
    }

    get canManageOrgs(): boolean {
        return this._can_manage_orgs;
    }

    set canManageOrgs(value: boolean) {
        this._can_manage_orgs = value;
    }

    get emailNotifications(): boolean {
        return this._email_notifications;
    }

    set emailNotifications(value: boolean) {
        this._email_notifications = value;
    }

    get twoFactorAuth(): boolean {
        return this._two_factor_auth;
    }

    set twoFactorAuth(value: boolean) {
        this._two_factor_auth = value;
    }

    get isAdmin(): boolean {
        return this._is_admin;
    }

    set isAdmin(value: boolean) {
        this._is_admin = value;
    }

    get isEmailVerified(): boolean {
        return this._is_email_verified;
    }

    set isEmailVerified(value: boolean) {
        this._is_email_verified = value;
    }

    get canCreateTagManagerTrial(): boolean {
        return this._can_create_tag_manager_trial;
    }

    set canCreateTagManagerTrial(value: boolean) {
        this._can_create_tag_manager_trial = value;
    }

    get canCreateDataManagerTrial(): boolean {
        return this._can_create_data_manager_trial;
    }

    set canCreateDataManagerTrial(value: boolean) {
        this._can_create_data_manager_trial = value;
    }
}
