import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import ScalarContainer from '../custom/ScalarContainer';

export default class GitHub extends Model {
    @Field<string>({
        required: true,
        exposeToGQLAs: 'user_id',
    })
    private _user_id: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'username',
    })
    private _username: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'email',
    })
    private _email: string;

    @Field<ScalarContainer<string>>({
        required: true,
        exposeToGQLAs: 'scope',
    })
    private _scope!: ScalarContainer<string>;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'auth_token',
    })
    private _auth_token: string;

    constructor(
        userId: string,
        username: string,
        email: string,
        scope: string[],
        authToken: string,
    ) {
        super();
        this._user_id = userId;
        this._username = username;
        this._email = email;
        if (scope !== undefined) {
            this._scope = new ScalarContainer(...scope);
        }
        this._auth_token = authToken;
    }

    get scope(): ScalarContainer<string> {
        return this._scope;
    }

    set scope(value: ScalarContainer<string>) {
        this._scope = value;
    }

    get authToken(): string {
        return this._auth_token;
    }

    set authToken(value: string) {
        this._auth_token = value;
    }
}
