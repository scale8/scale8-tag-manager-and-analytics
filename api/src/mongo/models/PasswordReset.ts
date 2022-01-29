import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import { ObjectId } from 'mongodb';
import User from './User';
import Hash from '../../core/Hash';

export default class PasswordReset extends Model {
    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'user_id',
    })
    private readonly _user_id!: ObjectId;

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

    get userId(): ObjectId {
        return this._user_id;
    }

    get token(): string {
        return this._token;
    }
}
