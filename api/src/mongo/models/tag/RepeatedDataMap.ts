import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Revision from './Revision';
import DataMap from './DataMap';
import DataMapRepo from '../../repos/tag/DataMapRepo';

export default class RepeatedDataMap extends Model {
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
    private readonly _name: string;

    @Field<ObjectId[]>({
        repository: DataMapRepo,
        required: true,
        exposeToGQLAs: 'repeated_child_data_map_ids',
        exposeToConfig: true,
    })
    private readonly _repeated_child_data_map_ids: ObjectId[];

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

    constructor(name: string, revision: Revision, repeatedChildDataMaps: DataMap[] = []) {
        super();
        this._name = name;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
        }
        this._repeated_child_data_map_ids = repeatedChildDataMaps.map((_) => _.id);
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get repeatedChildDataMapIds(): ObjectId[] {
        return this._repeated_child_data_map_ids;
    }

    get revisionId(): ObjectId {
        return this._revision_id;
    }
}
