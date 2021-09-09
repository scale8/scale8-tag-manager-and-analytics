import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import { ObjectID } from 'mongodb';
import User from './User';
import { NotificationType } from '../../enums/NotificationType';

export default class UserNotification extends Model {
    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'user_id',
    })
    private readonly _user_id!: ObjectID;

    @Field<NotificationType>({
        required: true,
        exposeToGQLAs: 'type',
    })
    private readonly _type: NotificationType;

    @Field<ObjectID>({
        exposeToGQLAs: 'entity_id',
    })
    private readonly _entity_id?: ObjectID;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_viewed',
    })
    private _is_viewed: boolean;

    constructor(user: User, type: NotificationType, entityId?: ObjectID) {
        super();
        if (user !== undefined) {
            this._user_id = user.id;
        }
        this._type = type;
        this._entity_id = entityId;
        this._is_viewed = false;
    }

    get userId(): ObjectID {
        return this._user_id;
    }

    get type(): NotificationType {
        return this._type;
    }

    get entityId(): ObjectID | undefined {
        return this._entity_id;
    }

    get isViewed(): boolean {
        return this._is_viewed;
    }

    set isViewed(value: boolean) {
        this._is_viewed = value;
    }
}
