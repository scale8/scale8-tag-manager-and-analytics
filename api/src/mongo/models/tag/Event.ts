import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import PlatformEvent from './PlatformEvent';
import { ObjectId } from 'mongodb';
import Revision from './Revision';
import DataMapRepo from '../../repos/tag/DataMapRepo';
import DataMap from './DataMap';

export default class Event extends Model {
    public getOrgEntityId(): ObjectId {
        return this.orgId;
    }

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectId;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'name',
        exposeToConfig: true,
    })
    private _name!: string;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private readonly _app_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'revision_id',
    })
    private readonly _revision_id!: ObjectId;

    @Field<ObjectId | string>({
        required: true,
        exposeToGQLAs: 'event',
        platformInstance: (_) => (_ instanceof ObjectId ? PlatformEvent : null),
        exposeToConfig: true,
    })
    private _event!: ObjectId | string;

    @Field<ObjectId[]>({
        repository: DataMapRepo,
        required: true,
        exposeToGQLAs: 'data_map_ids',
        exposeToConfig: true,
    })
    private _data_map_ids: ObjectId[] = [];

    @Field<number>({
        required: true,
        exposeToGQLAs: 'clear_state_ms',
        exposeToConfig: true,
    })
    private _clear_state_ms: number;

    constructor(
        revision: Revision,
        event: PlatformEvent | string,
        name?: string,
        dataMaps: DataMap[] = [],
        clearStateMs = -1,
    ) {
        super();
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
            this._event = typeof event === 'string' ? event : event.id;
            this._name =
                name === undefined ? (typeof event === 'string' ? event : event.name) : name;
        }
        this._data_map_ids = dataMaps.map((_) => _.id);
        this._clear_state_ms = clearStateMs;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get event(): ObjectId | string {
        return this._event;
    }

    set event(value: ObjectId | string) {
        this._event = value;
    }

    get tagManagerAccountId(): ObjectId {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectId {
        return this._app_id;
    }

    get revisionId(): ObjectId {
        return this._revision_id;
    }

    get dataMapIds(): ObjectId[] {
        return this._data_map_ids;
    }

    set dataMapIds(value: ObjectId[]) {
        this._data_map_ids = value;
    }

    get clearStateMs(): number {
        return this._clear_state_ms;
    }

    set clearStateMs(value: number) {
        this._clear_state_ms = value;
    }
}
