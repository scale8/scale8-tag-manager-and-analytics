import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import DataManagerAccount from './DataManagerAccount';
import { StorageProvider } from '../../../enums/StorageProvider';

export default class IngestEndpoint extends Model {
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
    private _name: string;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'data_manager_account_id',
    })
    private readonly _data_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: false,
    })
    private _usage_ingest_endpoint_environment_id?: ObjectID;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'analytics_enabled',
    })
    private _analytics_enabled: boolean;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'storage_provider',
    })
    private readonly _storage_provider!: StorageProvider;

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

    get dataManagerAccountId(): ObjectID {
        return this._data_manager_account_id;
    }

    get analytics_enabled(): boolean {
        return this._analytics_enabled;
    }

    set analytics_enabled(value: boolean) {
        this._analytics_enabled = value;
    }
}
