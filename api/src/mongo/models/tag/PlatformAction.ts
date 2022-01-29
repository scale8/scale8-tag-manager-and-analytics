import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import PlatformDataMap from './PlatformDataMap';
import { ObjectId } from 'mongodb';
import PlatformRevision from './PlatformRevision';
import PlatformDataMapRepo from '../../repos/tag/PlatformDataMapRepo';
import PlatformActionPermissionRepo from '../../repos/tag/PlatformActionPermissionRepo';
import PlatformActionPermission from './PlatformActionPermission';
import { TypeIcon } from '../../../../../common/enums/TypeIcon';

export default class PlatformAction extends Model {
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
        validation: (value) => value.match(/.+/) !== null,
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
        exposeToGQLAs: 's2s_endpoint',
        exposeToConfig: true,
        validation: (_) => /^(http|https):\/\/[^ "]+$/.test(_),
    })
    private readonly _s2s_endpoint?: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'description',
        validation: (value) => value.match(/.+/) !== null,
    })
    private _description: string;

    @Field<string>({
        required: false,
        exposeToGQLAs: 'code',
        exposeToConfig: true,
    })
    private _code?: string;

    @Field<ObjectId[]>({
        repository: PlatformDataMapRepo,
        required: true,
        exposeToGQLAs: 'platform_data_map_ids',
        exposeToConfig: true,
    })
    private _platform_data_map_ids: ObjectId[] = [];

    @Field<ObjectId[]>({
        repository: PlatformActionPermissionRepo,
        required: true,
        exposeToGQLAs: 'platform_action_permission_ids',
        exposeToConfig: true,
    })
    private _platform_action_permission_ids: ObjectId[] = [];

    @Field<TypeIcon>({
        required: false,
        exposeToGQLAs: 'icon',
    })
    private _icon?: TypeIcon;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'exec_raw_in_iframe',
        exposeToConfig: true,
    })
    private _exec_raw_in_iframe: boolean;

    //todo... we need to add setup, test(s) to this structure.
    constructor(
        name: string,
        platformRevision: PlatformRevision,
        description: string,
        platformDataMaps: PlatformDataMap[] = [],
        s2sEndpoint?: string,
        code?: string,
        platformActionPermissions?: PlatformActionPermission[],
        icon?: TypeIcon,
        execRawInIframe?: boolean,
    ) {
        super();
        this._name = name;
        if (platformRevision !== undefined) {
            this._org_id = platformRevision.orgId;
            this._tag_manager_account_id = platformRevision.tagManagerAccountId;
            this._platform_id = platformRevision.platformId;
            this._revision_id = platformRevision.id;
            this._platform_data_map_ids = platformDataMaps.map((_) => _.id);
        }
        this._description = description;
        this._s2s_endpoint = s2sEndpoint;
        this._code = code;
        this._platform_action_permission_ids =
            platformActionPermissions === undefined
                ? []
                : platformActionPermissions.map((_) => _.id);
        this._icon = icon;
        this._exec_raw_in_iframe = execRawInIframe === true;
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

    get code(): string | undefined {
        return this._code;
    }

    set code(value: string | undefined) {
        this._code = value;
    }

    get icon(): TypeIcon | undefined {
        return this._icon;
    }

    set icon(value: TypeIcon | undefined) {
        this._icon = value;
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

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get platformDataMapIds(): ObjectId[] {
        return this._platform_data_map_ids;
    }

    set platformDataMapIds(value: ObjectId[]) {
        this._platform_data_map_ids = value;
    }

    get platformActionPermissionIds(): ObjectId[] {
        return this._platform_action_permission_ids;
    }

    set platformActionPermissionIds(value: ObjectId[]) {
        this._platform_action_permission_ids = value;
    }

    get execRawInIframe(): boolean {
        return this._exec_raw_in_iframe;
    }

    set execRawInIframe(_: boolean) {
        this._exec_raw_in_iframe = true;
    }
}
