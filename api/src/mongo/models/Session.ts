import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import Hash from '../../core/Hash';

export default class Session extends Model {
    @Field<string>({
        required: true,
        exposeToGQLAs: 'token',
        defaultValue: () => Hash.randomHash(),
    })
    private _token: string;

    constructor(token: string) {
        super();
        this._token = token;
    }

    get token(): string {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }
}
