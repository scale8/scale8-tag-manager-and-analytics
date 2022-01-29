import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import Platform from './Platform';
import PlatformDataMapRepo from '../../repos/tag/PlatformDataMapRepo';
import PlatformAssetRepo from '../../repos/tag/PlatformAssetRepo';
import PlatformDataContainerRepo from '../../repos/tag/PlatformDataContainerRepo';
import PlatformActionRepo from '../../repos/tag/PlatformActionRepo';
import PlatformEventRepo from '../../repos/tag/PlatformEventRepo';

export default class PlatformRevision extends Model {
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
        platformAutoMerge: true, //we expect this name to change, so allow auto merge without conflict
        exposeToConfig: true,
    })
    private _name: string;

    @Field<ObjectId>({
        exposeToGQLAs: 'parent_revision_id',
    })
    private _parent_revision_id?: ObjectId;

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

    @Field<ObjectId[]>({
        repository: PlatformDataMapRepo,
        required: true,
        exposeToGQLAs: 'platform_setting_ids',
        exposeToConfig: true,
    })
    private _platform_setting_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: PlatformAssetRepo,
        required: true,
        exposeToGQLAs: 'platform_asset_ids',
        exposeToConfig: true,
    })
    private _platform_asset_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: PlatformEventRepo,
        required: true,
        exposeToGQLAs: 'platform_event_ids',
        exposeToConfig: true,
    })
    private _platform_event_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: PlatformDataContainerRepo,
        required: true,
        exposeToGQLAs: 'platform_data_container_ids',
        exposeToConfig: true,
    })
    private _platform_data_container_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: PlatformActionRepo,
        required: true,
        exposeToGQLAs: 'platform_action_ids',
        exposeToConfig: true,
    })
    private _platform_action_ids: ObjectId[] = [];

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'locked',
        exposeToConfig: true,
    })
    private _is_final: boolean;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_published',
        exposeToConfig: true,
    })
    private _is_published: boolean;

    constructor(name: string, platform: Platform, isFinal = false) {
        super();
        this._name = name;
        if (platform !== undefined) {
            this._org_id = platform.orgId;
            this._tag_manager_account_id = platform.tagManagerAccountId;
            this._platform_id = platform.id;
        }
        this._is_final = isFinal;
        this._is_published = false;
    }

    get parentRevisionId(): ObjectId | undefined {
        return this._parent_revision_id;
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

    get platformId(): ObjectId {
        return this._platform_id;
    }

    get platformSettingsIds(): ObjectId[] {
        return this._platform_setting_ids;
    }

    set platformSettingsIds(value: ObjectId[]) {
        this._platform_setting_ids = value;
    }

    get platformAssetIds(): ObjectId[] {
        return this._platform_asset_ids;
    }

    set platformAssetIds(value: ObjectId[]) {
        this._platform_asset_ids = value;
    }

    get platformEventIds(): ObjectId[] {
        return this._platform_event_ids;
    }

    set platformEventIds(value: ObjectId[]) {
        this._platform_event_ids = value;
    }

    get platformDataContainerIds(): ObjectId[] {
        return this._platform_data_container_ids;
    }

    set platformDataContainerIds(value: ObjectId[]) {
        this._platform_data_container_ids = value;
    }

    get platformActionIds(): ObjectId[] {
        return this._platform_action_ids;
    }

    set platformActionIds(value: ObjectId[]) {
        this._platform_action_ids = value;
    }

    get isFinal(): boolean {
        return this._is_final;
    }

    set isFinal(value: boolean) {
        this._is_final = value;
    }

    get isPublished(): boolean {
        return this._is_published;
    }

    set isPublished(value: boolean) {
        this._is_published = value;
    }
}
