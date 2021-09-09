import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import { ObjectID } from 'mongodb';
import User from './User';
import Hash from '../../core/Hash';

export default class PasswordReset extends Model {
    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'user_id',
    })
    private readonly _user_id!: ObjectID;

    @Field<string>({
        required: true,
    })
    private readonly _token: string;

    constructor(user: User) {
        super();
        if (user !== undefined) {
            this._user_id = user.id;
        }
        this._token = Hash.simpleRandomHash();
    }

    get userId(): ObjectID {
        return this._user_id;
    }

    get token(): string {
        return this._token;
    }
}
