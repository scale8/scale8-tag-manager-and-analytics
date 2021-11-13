import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import DataManagerAccount from './DataManagerAccount';
import { StorageProvider } from '../../../enums/StorageProvider';

export default class IngestEndpoint extends Model {
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
        exposeToGQLAs: 'data_manager_account_id',
    })
    private readonly _data_manager_account_id!: ObjectId;

    @Field<ObjectId>({
        required: false,
    })
    private _usage_ingest_endpoint_environment_id?: ObjectId;

    @Field<boolean>({
        required: true,
        defaultValue: () => true,
        exposeToGQLAs: 'analytics_enabled',
    })
    private _analytics_enabled: boolean;

    @Field<string>({
        required: true,
        defaultValue: () => StorageProvider.MONGODB,
        exposeToGQLAs: 'storage_provider',
    })
    private readonly _storage_provider!: StorageProvider;

    @Field<string>({
        required: true,
        defaultValue: () => '',
    })
    private _storage_provider_config_hash: string | undefined;

    constructor(
        name: string,
        dataManagerAccount: DataManagerAccount,
        analyticsEnabled = true,
        storageProvider: StorageProvider,
    ) {
        super();
        this._name = name;
        this._analytics_enabled = analyticsEnabled;
        if (dataManagerAccount !== undefined) {
            this._org_id = dataManagerAccount.orgId;
            this._data_manager_account_id = dataManagerAccount.id;
        }
        this._storage_provider = storageProvider;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    set usageIngestEndpointEnvironmentId(value: ObjectId | undefined) {
        this._usage_ingest_endpoint_environment_id = value;
    }

    get usageIngestEndpointEnvironmentId(): ObjectId | undefined {
        return this._usage_ingest_endpoint_environment_id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get dataManagerAccountId(): ObjectId {
        return this._data_manager_account_id;
    }

    get analyticsEnabled(): boolean {
        return this._analytics_enabled;
    }

    set analyticsEnabled(value: boolean) {
        this._analytics_enabled = value;
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
