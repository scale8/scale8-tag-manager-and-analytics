import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import { ObjectID } from 'mongodb';
import TagManagerAccount from './tag/TagManagerAccount';
import DataManagerAccount from './data/DataManagerAccount';
import { startOfDay } from 'date-fns';

export default class Usage extends Model {
    @Field<string>({
        required: true,
        exposeToGQLAs: 'usage_entity',
    })
    private readonly _usage_entity!: string;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'usage_entity_id',
    })
    private readonly _usage_entity_id!: ObjectID;

    @Field<Date>({
        required: true,
        exposeToGQLAs: 'day',
    })
    private readonly _day: Date;

    @Field<number>({
        required: true,
        exposeToGQLAs: 'requests',
    })
    private _requests: number;

    @Field<number>({
        exposeToGQLAs: 'bytes',
    })
    private _bytes?: number;

    constructor(
        usageEntity: TagManagerAccount | DataManagerAccount,
        day: Date,
        requests: number,
        bytes = 0,
    ) {
        super();
        if (usageEntity !== undefined) {
            this._usage_entity = usageEntity.constructor.name;
            this._usage_entity_id = usageEntity.id;
        }
        this._day = startOfDay(day);
        this._requests = requests;
        if (bytes > 0) {
            this._bytes = bytes;
        }
    }

    get usageEntity(): string {
        return this._usage_entity;
    }

    get usageEntityId(): ObjectID {
        return this._usage_entity_id;
    }

    get day(): Date {
        return this._day;
    }

    get requests(): number {
        return this._requests;
    }

    set requests(value: number) {
        this._requests = value;
    }

    get bytes(): number {
        return this._requests || 0;
    }

    set bytes(value: number) {
        this._bytes = value;
    }
}
