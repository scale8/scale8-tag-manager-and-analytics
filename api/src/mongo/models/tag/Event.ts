import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import PlatformEvent from './PlatformEvent';
import { ObjectID } from 'mongodb';
import Revision from './Revision';
import DataMapRepo from '../../repos/tag/DataMapRepo';
import DataMap from './DataMap';

export default class Event extends Model {
    public getOrgEntityId(): ObjectID {
        return this.orgId;
    }

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectID;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'name',
        exposeToConfig: true,
    })
    private _name!: string;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private readonly _app_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'revision_id',
    })
    private readonly _revision_id!: ObjectID;

    @Field<ObjectID | string>({
        required: true,
        exposeToGQLAs: 'event',
        platformInstance: (_) => (_ instanceof ObjectID ? PlatformEvent : null),
        exposeToConfig: true,
    })
    private _event!: ObjectID | string;

    @Field<ObjectID[]>({
        repository: DataMapRepo,
        required: true,
        exposeToGQLAs: 'data_map_ids',
        exposeToConfig: true,
    })
    private _data_map_ids: ObjectID[] = [];

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

    get orgId(): ObjectID {
        return this._org_id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get event(): ObjectID | string {
        return this._event;
    }

    set event(value: ObjectID | string) {
        this._event = value;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectID {
        return this._app_id;
    }

    get revisionId(): ObjectID {
        return this._revision_id;
    }

    get dataMapIds(): ObjectID[] {
        return this._data_map_ids;
    }

    set dataMapIds(value: ObjectID[]) {
        this._data_map_ids = value;
    }

    get clearStateMs(): number {
        return this._clear_state_ms;
    }

    set clearStateMs(value: number) {
        this._clear_state_ms = value;
    }
}
