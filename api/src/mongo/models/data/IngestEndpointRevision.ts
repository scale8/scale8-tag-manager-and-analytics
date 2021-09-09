import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import IngestEndpoint from './IngestEndpoint';
import IngestEndpointDataMapRepo from '../../repos/data/IngestEndpointDataMapRepo';

export default class IngestEndpointRevision extends Model {
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
        platformAutoMerge: true, //we expect this name to change, so allow auto merge without conflict
        exposeToConfig: true,
    })
    private _name: string;

    @Field<ObjectID>({
        exposeToGQLAs: 'parent_revision_id',
    })
    private _parent_revision_id?: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'data_manager_account_id',
    })
    private readonly _data_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'ingest_endpoint_id',
        exposeToConfig: true,
    })
    private readonly _ingest_endpoint_id!: ObjectID;

    @Field<ObjectID[]>({
        repository: IngestEndpointDataMapRepo,
        required: true,
        exposeToGQLAs: 'ingest_endpoint_data_map_ids',
        exposeToConfig: true,
    })
    private ingest_endpoint_data_map_ids: ObjectID[] = [];

    @Field<boolean>({
        required: true,
        defaultValue: () => false,
        exposeToGQLAs: 'locked',
        exposeToConfig: true,
    })
    private _is_final!: boolean;

    constructor(name: string, ingestEndpoint: IngestEndpoint) {
        super();
        this._name = name;
        if (ingestEndpoint !== undefined) {
            this._org_id = ingestEndpoint.orgId;
            this._ingest_endpoint_id = ingestEndpoint.id;
            this._data_manager_account_id = ingestEndpoint.dataManagerAccountId;
        }
    }

    get parentRevisionId(): ObjectID | undefined {
        return this._parent_revision_id;
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

    get dataManagerAccountId(): ObjectID {
        return this._data_manager_account_id;
    }

    get ingestEndpointId(): ObjectID {
        return this._ingest_endpoint_id;
    }

    get ingestEndpointDataMapIds(): ObjectID[] {
        return this.ingest_endpoint_data_map_ids;
    }

    set ingestEndpointDataMapIds(value: ObjectID[]) {
        this.ingest_endpoint_data_map_ids = value;
    }

    get isFinal(): boolean {
        return this._is_final;
    }

    set isFinal(value: boolean) {
        this._is_final = value;
    }
}
