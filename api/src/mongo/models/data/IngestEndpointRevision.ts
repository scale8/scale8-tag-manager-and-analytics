import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectId } from 'mongodb';
import IngestEndpoint from './IngestEndpoint';
import IngestEndpointDataMapRepo from '../../repos/data/IngestEndpointDataMapRepo';

export default class IngestEndpointRevision extends Model {
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
        exposeToGQLAs: 'data_manager_account_id',
    })
    private readonly _data_manager_account_id!: ObjectId;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'ingest_endpoint_id',
        exposeToConfig: true,
    })
    private readonly _ingest_endpoint_id!: ObjectId;

    @Field<ObjectId[]>({
        repository: IngestEndpointDataMapRepo,
        required: true,
        exposeToGQLAs: 'ingest_endpoint_data_map_ids',
        exposeToConfig: true,
    })
    private ingest_endpoint_data_map_ids: ObjectId[] = [];

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

    get dataManagerAccountId(): ObjectId {
        return this._data_manager_account_id;
    }

    get ingestEndpointId(): ObjectId {
        return this._ingest_endpoint_id;
    }

    get ingestEndpointDataMapIds(): ObjectId[] {
        return this.ingest_endpoint_data_map_ids;
    }

    set ingestEndpointDataMapIds(value: ObjectId[]) {
        this.ingest_endpoint_data_map_ids = value;
    }

    get isFinal(): boolean {
        return this._is_final;
    }

    set isFinal(value: boolean) {
        this._is_final = value;
    }
}
