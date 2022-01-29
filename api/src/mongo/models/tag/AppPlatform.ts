import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Platform from './Platform';

export default class AppPlatform extends Model {
    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'platform_id',
    })
    private _platform_id!: ObjectId;

    constructor(platform: Platform) {
        super();
        if (platform !== undefined) {
            this._platform_id = platform.id;
        }
    }

    get platformId(): ObjectId {
        return this._platform_id;
    }

    set platformId(value: ObjectId) {
        this._platform_id = value;
    }
}
