import Model from '../abstractions/Model';
import Field from '../decorators/Field';

export default class EnvironmentVariable extends Model {
    @Field<string>({
        required: true,
        exposeToGQLAs: 'key',
    })
    private readonly _key: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'value',
    })
    private readonly _value: string;

    constructor(key: string, value: string) {
        super();
        this._key = key;
        this._value = value;
    }

    get key(): string {
        return this._key;
    }

    get value(): string {
        return this._value;
    }
}
