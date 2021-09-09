import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import Platform from './Platform';

export default class AppPlatform extends Model {
    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_id',
    })
    private _platform_id!: ObjectID;

    constructor(platform: Platform) {
        super();
        if (platform !== undefined) {
            this._platform_id = platform.id;
        }
    }

    get platformId(): ObjectID {
        return this._platform_id;
    }

    set platformId(value: ObjectID) {
        this._platform_id = value;
    }
}
