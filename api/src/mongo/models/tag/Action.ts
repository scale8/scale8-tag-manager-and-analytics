import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import PlatformAction from './PlatformAction';
import DataMap from './DataMap';
import Revision from './Revision';
import DataMapRepo from '../../repos/tag/DataMapRepo';

export default class Action extends Model {
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
    private _name: string;

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

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'platform_action_id',
        platformInstance: () => PlatformAction,
        exposeToConfig: true,
    })
    private _platform_action_id!: ObjectId;

    @Field<ObjectId[]>({
        repository: DataMapRepo,
        required: true,
        exposeToGQLAs: 'data_map_ids',
        exposeToConfig: true,
    })
    private _data_map_ids: ObjectId[] = [];

    constructor(
        name: string,
        revision: Revision,
        platformAction: PlatformAction,
        dataMaps: DataMap[] = [],
    ) {
        super();
        this._name = name;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
            this._platform_action_id = platformAction.id;
        }
        this._data_map_ids = dataMaps.map((_) => _.id);
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

    get tagManagerAccountId(): ObjectId {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectId {
        return this._app_id;
    }

    get revisionId(): ObjectId {
        return this._revision_id;
    }

    get platformActionId(): ObjectId {
        return this._platform_action_id;
    }

    set platformActionId(value: ObjectId) {
        this._platform_action_id = value;
    }

    get dataMapIds(): ObjectId[] {
        return this._data_map_ids;
    }

    set dataMapIds(value: ObjectId[]) {
        this._data_map_ids = value;
    }
}
