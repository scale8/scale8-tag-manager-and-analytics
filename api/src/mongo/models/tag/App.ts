import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import AppPlatform from './AppPlatform';
import AppPlatformRepo from '../../repos/tag/AppPlatformRepo';
import TagManagerAccount from './TagManagerAccount';
import { AppType } from '../../../enums/AppType';
import { StorageProvider } from '../../../enums/StorageProvider';

export default class App extends Model {
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
    })
    private _name: string;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: false,
    })
    private _usage_ingest_endpoint_environment_id?: ObjectID;

    @Field<boolean>({
        required: true,
        defaultValue: () => true,
        exposeToGQLAs: 'analytics_enabled',
    })
    private _analytics_enabled: boolean;

    @Field<boolean>({
        required: true,
        defaultValue: () => true,
        exposeToGQLAs: 'error_tracking_enabled',
    })
    private _error_tracking_enabled: boolean;

    @Field<AppPlatform[]>({
        repository: AppPlatformRepo,
        required: true,
    })
    private _app_platforms!: AppPlatform[];

    @Field<AppType>({
        required: true,
        exposeToGQLAs: 'type',
    })
    private readonly _type: AppType;

    @Field<string>({
        required: true,
        defaultValue: () => StorageProvider.MONGODB,
        exposeToGQLAs: 'storage_provider',
    })
    private readonly _storage_provider!: StorageProvider;

    /**
     * _domain - All apps, web, mobile web, desktop apps and mobile apps need this. (Ads.txt!)
     */
    @Field<string>({
        required: true,
        exposeToGQLAs: 'domain',
    })
    private _domain: string;

    @Field<string>({
        required: true,
        defaultValue: () => '',
    })
    private _storage_provider_config_hash: string | undefined;

    constructor(
        name: string,
        tagManagerAccount: TagManagerAccount,
        domain: string,
        storageProvider: StorageProvider,
        type: AppType = AppType.WEB,
        appPlatforms: AppPlatform[] = [],
        analyticsEnabled = true,
        errorTrackingEnabled = true,
    ) {
        super();
        if (tagManagerAccount !== undefined) {
            this._org_id = tagManagerAccount.orgId;
            this._tag_manager_account_id = tagManagerAccount.id;
        }
        this._app_platforms = appPlatforms;
        this._name = name;
        this._type = type;
        this._domain = domain;
        this._analytics_enabled = analyticsEnabled;
        this._error_tracking_enabled = errorTrackingEnabled;
        this._storage_provider = storageProvider;
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    set usageIngestEndpointEnvironmentId(value: ObjectID | undefined) {
        this._usage_ingest_endpoint_environment_id = value;
    }

    get usageIngestEndpointEnvironmentId(): ObjectID | undefined {
        return this._usage_ingest_endpoint_environment_id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get appPlatforms(): AppPlatform[] {
        return this._app_platforms;
    }

    set appPlatforms(value: AppPlatform[]) {
        this._app_platforms = value;
    }

    get type(): AppType {
        return this._type;
    }

    get domain(): string {
        return this._domain;
    }

    set domain(value: string) {
        this._domain = value;
    }

    get analyticsEnabled(): boolean {
        return this._analytics_enabled;
    }

    set analyticsEnabled(value: boolean) {
        this._analytics_enabled = value;
    }

    get errorTrackingEnabled(): boolean {
        return this._error_tracking_enabled;
    }

    set errorTrackingEnabled(value: boolean) {
        this._error_tracking_enabled = value;
    }

    get storageProvider(): StorageProvider {
        return this._storage_provider;
    }

    get storageProviderConfigHash(): string {
        return this._storage_provider_config_hash ?? '';
    }

    set storageProviderConfigHash(value: string) {
        this._storage_provider_config_hash = value;
    }
}
