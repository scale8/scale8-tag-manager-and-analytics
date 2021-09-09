import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import PlatformDataMap from './PlatformDataMap';
import PlatformRevision from './PlatformRevision';
import PlatformDataMapRepo from '../../repos/tag/PlatformDataMapRepo';
import { TypeIcon } from '../../../../../common/enums/TypeIcon';

export default class PlatformDataContainer extends Model {
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
        platformAutoMerge: true,
        exposeToConfig: true,
    })
    private _name: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'description',
        platformAutoMerge: true, //change in name here will not cause any conflicts in behaviour
    })
    private _description: string;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_id',
        exposeToConfig: true,
    })
    private readonly _platform_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_revision_id',
        exposeToConfig: true,
    })
    private readonly _revision_id!: ObjectID;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'allow_custom',
        exposeToConfig: true,
    })
    private _allow_custom: boolean;

    @Field<ObjectID[]>({
        repository: PlatformDataMapRepo,
        required: true,
        exposeToGQLAs: 'platform_data_map_ids',
        exposeToConfig: true,
    })
    private _platform_data_map_ids: ObjectID[] = [];

    @Field<TypeIcon>({
        required: false,
        exposeToGQLAs: 'icon',
    })
    private _icon?: TypeIcon;

    constructor(
        name: string,
        description: string,
        platformRevision: PlatformRevision,
        platformDataMaps: PlatformDataMap[] = [],
        allowCustom = false,
        icon?: TypeIcon,
    ) {
        super();
        this._name = name;
        this._description = description;
        if (platformRevision !== undefined) {
            this._org_id = platformRevision.orgId;
            this._tag_manager_account_id = platformRevision.tagManagerAccountId;
            this._platform_id = platformRevision.platformId;
            this._revision_id = platformRevision.id;
        }
        this._platform_data_map_ids = platformDataMaps.map((_) => _.id);
        this._allow_custom = allowCustom;
        this._icon = icon;
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

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get platformId(): ObjectID {
        return this._platform_id;
    }

    get platformRevisionId(): ObjectID {
        return this._revision_id;
    }

    get allowCustom(): boolean {
        return this._allow_custom;
    }

    set allowCustom(value: boolean) {
        this._allow_custom = value;
    }

    get platformDataMapIds(): ObjectID[] {
        return this._platform_data_map_ids;
    }

    set platformDataMapIds(value: ObjectID[]) {
        this._platform_data_map_ids = value;
    }

    get icon(): TypeIcon | undefined {
        return this._icon;
    }

    set icon(value: TypeIcon | undefined) {
        this._icon = value;
    }
}
