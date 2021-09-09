import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import ValidationError from '../../errors/ValidationError';
import SignUpType from '../../enums/SignUpType';
import Hash from '../../core/Hash';
import userMessages from '../../errors/UserMessages';

export default class SignUpRequest extends Model {
    @Field<string>({
        required: true,
    })
    private readonly _token: string;

    @Field<SignUpType>({
        required: true,
        exposeToGQLAs: 'sign_up_type',
    })
    private readonly _sign_up_type: SignUpType;

    @Field<string>({
        required: false,
        exposeToGQLAs: 'org_name',
        validation: (value) => value.match(/.+/) !== null,
    })
    private readonly _org_name: string | undefined;

    @Field<string>({
        required: false,
        exposeToGQLAs: 'domain',
        validation: (value) => value.match(/.+/) !== null,
    })
    private readonly _domain: string | undefined;

    @Field<string>({
        required: false,
    })
    private _password: string | undefined;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'first_name',
        validation: (value) => value.match(/.+/) !== null,
    })
    private readonly _first_name!: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'last_name',
        validation: (value) => value.match(/.+/) !== null,
    })
    private readonly _last_name!: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'email',
        validation: (value) => value.match(/.+@.+/) !== null,
    })
    private readonly _email: string;

    @Field<string>({
        required: false,
    })
    private readonly _git_hub_user: string | undefined;

    constructor(
        signUpType: SignUpType,
        fullName: string,
        email: string,
        domain?: string,
        orgName?: string,
        password?: string,
        gitHubId?: string,
    ) {
        super();
        if (typeof fullName === 'string') {
            const nameParts = fullName.match(/([a-z]+)/gi);
            if (nameParts === null) {
                throw new ValidationError(userMessages.validationName, true);
            }
            if (nameParts.length < 2) {
                throw new ValidationError(userMessages.validationMissingLastName, true);
            }
            this._first_name = nameParts[0];
            this._last_name = nameParts.splice(1).join(' ');
        }

        this._email = email;

        this._password = password !== undefined ? Hash.hashString(password) : undefined;

        this._git_hub_user = gitHubId !== undefined ? gitHubId : undefined;

        this._sign_up_type = signUpType;

        if (signUpType === SignUpType.TAG_MANAGER) {
            if (typeof domain === 'string') {
                this._domain = domain;
                this._org_name = domain;
            } else {
                throw new ValidationError(userMessages.validationMissingDomain, true);
            }
        }

        if (signUpType === SignUpType.DATA_MANAGER) {
            if (typeof orgName === 'string') {
                this._org_name = orgName;
            } else {
                throw new ValidationError(userMessages.validationMissingOrgInDMAccount, true);
            }
        }

        if (signUpType === SignUpType.INVITE) {
            this._org_name = orgName;
        }

        this._token = Hash.simpleRandomHash();
    }

    get sign_up_type(): SignUpType {
        return this._sign_up_type;
    }

    get org_name(): string | undefined {
        return this._org_name;
    }

    get domain(): string | undefined {
        return this._domain;
    }

    get first_name(): string {
        return this._first_name;
    }

    get last_name(): string {
        return this._last_name;
    }

    get email(): string {
        return this._email;
    }

    get token(): string {
        return this._token;
    }

    get password(): string | undefined {
        return this._password;
    }

    get git_hub_user(): string | undefined {
        return this._git_hub_user;
    }
}
