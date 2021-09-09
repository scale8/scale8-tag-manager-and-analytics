import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import PlatformRevision from './PlatformRevision';
import Revision from './Revision';
import DataMapRepo from '../../repos/tag/DataMapRepo';
import DataMap from './DataMap';

export default class AppPlatformRevision extends Model {
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
        exposeToGQLAs: 'revision_id',
    })
    private readonly _revision_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_id',
    })
    private readonly _platform_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_revision_id',
        platformInstance: () => PlatformRevision,
        exposeToConfig: true,
    })
    private readonly _platform_revision_id!: ObjectID;

    @Field<ObjectID[]>({
        repository: DataMapRepo,
        required: true,
        exposeToGQLAs: 'platform_settings_data_map_ids',
        exposeToConfig: true,
    })
    private readonly _platform_settings_data_map_ids: ObjectID[] = [];

    constructor(revision: Revision, platformRevision: PlatformRevision, settings: DataMap[] = []) {
        super();
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._name = platformRevision.name;
            this._revision_id = revision.id;
            this._platform_id = platformRevision.platformId;
            this._platform_revision_id = platformRevision.id;
            this._tag_manager_account_id = revision.tagManagerAccountId;
        }
        this._platform_settings_data_map_ids = settings.map((_) => _.id);
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get revisionId(): ObjectID {
        return this._revision_id;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get platformRevisionId(): ObjectID {
        return this._platform_revision_id;
    }

    get platformSettingsDataMapIds(): ObjectID[] {
        return this._platform_settings_data_map_ids;
    }
}
