import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import IngestEndpointRevision from './IngestEndpointRevision';
import IngestEndpoint from './IngestEndpoint';
import { StorageProvider } from '../../../enums/StorageProvider';

export default class IngestEndpointEnvironment extends Model {
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
    })
    private _name: string;

    @Field<string>({
        exposeToGQLAs: 'custom_domain',
    })
    private _custom_domain?: string;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'data_manager_account_id',
    })
    private readonly _data_manager_account_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'ingest_endpoint_id',
        exposeToConfig: true,
    })
    private readonly _ingest_endpoint_id!: ObjectId;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'storage_provider',
    })
    private readonly _storage_provider!: StorageProvider;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'config_hint',
    })
    private _config_hint!: string;

    @Field<ObjectId>({
        exposeToGQLAs: 'ingest_endpoint_revision_id',
    })
    private _ingest_endpoint_revision_id!: ObjectId;

    constructor(
        name: string,
        ingestEndpoint: IngestEndpoint,
        storageProvider: StorageProvider,
        configHint: string,
        ingestEndpointRevision: IngestEndpointRevision,
        customDomain?: string,
    ) {
        super();
        this._name = name;
        this._custom_domain = customDomain;
        if (ingestEndpoint !== undefined) {
            this._org_id = ingestEndpoint.orgId;
            this._storage_provider = storageProvider;
            this._config_hint = configHint;
            this._data_manager_account_id = ingestEndpoint.dataManagerAccountId;
            this._ingest_endpoint_id = ingestEndpoint.id;
        }
        if (ingestEndpointRevision !== undefined) {
            this._ingest_endpoint_revision_id = ingestEndpointRevision.id;
        }
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get dataManagerAccountId(): ObjectId {
        return this._data_manager_account_id;
    }

    get ingestEndpointId(): ObjectId {
        return this._ingest_endpoint_id;
    }

    get storageProvider(): StorageProvider {
        return this._storage_provider;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get customDomain(): string | undefined {
        return this._custom_domain;
    }

    set customDomain(value: string | undefined) {
        this._custom_domain = value;
    }

    get ingestEndpointRevisionId(): ObjectId {
        return this._ingest_endpoint_revision_id;
    }

    set ingestEndpointRevisionId(value: ObjectId) {
        this._ingest_endpoint_revision_id = value;
    }

    set configHint(value: string) {
        this._config_hint = value;
    }
}
