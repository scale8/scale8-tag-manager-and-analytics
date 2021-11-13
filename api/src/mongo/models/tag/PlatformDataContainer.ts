import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import PlatformDataMap from './PlatformDataMap';
import PlatformRevision from './PlatformRevision';
import PlatformDataMapRepo from '../../repos/tag/PlatformDataMapRepo';
import { TypeIcon } from '../../../../../common/enums/TypeIcon';

export default class PlatformDataContainer extends Model {
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

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'platform_id',
        exposeToConfig: true,
    })
    private readonly _platform_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'platform_revision_id',
        exposeToConfig: true,
    })
    private readonly _revision_id!: ObjectId;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'allow_custom',
        exposeToConfig: true,
    })
    private _allow_custom: boolean;

    @Field<ObjectId[]>({
        repository: PlatformDataMapRepo,
        required: true,
        exposeToGQLAs: 'platform_data_map_ids',
        exposeToConfig: true,
    })
    private _platform_data_map_ids: ObjectId[] = [];

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

    get orgId(): ObjectId {
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

    get tagManagerAccountId(): ObjectId {
        return this._tag_manager_account_id;
    }

    get platformId(): ObjectId {
        return this._platform_id;
    }

    get platformRevisionId(): ObjectId {
        return this._revision_id;
    }

    get allowCustom(): boolean {
        return this._allow_custom;
    }

    set allowCustom(value: boolean) {
        this._allow_custom = value;
    }

    get platformDataMapIds(): ObjectId[] {
        return this._platform_data_map_ids;
    }

    set platformDataMapIds(value: ObjectId[]) {
        this._platform_data_map_ids = value;
    }

    get icon(): TypeIcon | undefined {
        return this._icon;
    }

    set icon(value: TypeIcon | undefined) {
        this._icon = value;
    }
}
