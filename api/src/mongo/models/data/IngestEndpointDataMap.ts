import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { IngestEndpointDataMapValidation } from '../../types/Types';
import { ObjectID } from 'mongodb';
import ScalarContainer from '../../custom/ScalarContainer';
import S8VarTypeValidation from '../../../core/S8VarTypeValidation';
import IngestEndpointRevision from './IngestEndpointRevision';
import IngestEndpointDataMapRepo from '../../repos/data/IngestEndpointDataMapRepo';
import S8ValidatorValidation from '../../../core/S8ValidatorValidation';
import GenericError from '../../../errors/GenericError';
import { VarType } from '../../../enums/VarType';
import { LogPriority } from '../../../enums/LogPriority';
import { DataMapValue } from '../../../../../common/types/Types';

export default class IngestEndpointDataMap extends Model {
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
        required: true,
        exposeToGQLAs: 'ingest_endpoint_id',
        exposeToConfig: true,
    })
    private readonly _ingest_endpoint_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'ingest_endpoint_revision_id',
        exposeToConfig: true,
    })
    private readonly _revision_id!: ObjectID;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'key',
        validation: (_) => _.match(/^[a-z_]+[a-z0-9_]*$/) !== null,
        exposeToConfig: true,
    })
    private _key: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'var_type',
        exposeToConfig: true,
    })
    private _var_type: VarType;

    @Field<DataMapValue | ScalarContainer<DataMapValue>>({
        exposeToGQLAs: 'default_value',
        exposeToConfig: true,
    })
    private _default_value?: DataMapValue | ScalarContainer<DataMapValue>;

    @Field<ObjectID[]>({
        repository: IngestEndpointDataMapRepo,
        required: true,
        exposeToGQLAs: 'child_ingest_endpoint_data_map_ids',
        exposeToConfig: true,
    })
    private _child_ingest_endpoint_data_map_ids: ObjectID[] = [];

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_optional',
    })
    private _is_optional: boolean;

    @Field<ScalarContainer<string>>({
        required: false,
        exposeToGQLAs: 'validations',
    })
    private _validations?: ScalarContainer<string>;

    constructor(
        key: string,
        ingestEndpointRevision: IngestEndpointRevision,
        varType: VarType,
        childIngestEndpointDataMaps: IngestEndpointDataMap[] = [], //used for creating document style points
        defaultValue?: DataMapValue | ScalarContainer<DataMapValue>,
        isOptional = true,
        validations?: IngestEndpointDataMapValidation[],
    ) {
        super();
        this._name = key;
        this._key = key;
        if (ingestEndpointRevision !== undefined) {
            this._org_id = ingestEndpointRevision.orgId;
            this._data_manager_account_id = ingestEndpointRevision.dataManagerAccountId;
            this._ingest_endpoint_id = ingestEndpointRevision.ingestEndpointId;
            this._revision_id = ingestEndpointRevision.id;
        }
        this._var_type = varType;
        if (varType === VarType.ARRAY_OBJECT || varType === VarType.OBJECT) {
            this._child_ingest_endpoint_data_map_ids = childIngestEndpointDataMaps.map((_) => _.id);
        } else if (
            S8VarTypeValidation.checkIngestVarTypeAndDefaultValueAlign(varType, defaultValue)
        ) {
            this._default_value = defaultValue;
        }
        this._is_optional = isOptional;
        this.validations = validations;
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get dataManagerAccountId(): ObjectID {
        return this._data_manager_account_id;
    }

    get ingestEndpointId(): ObjectID {
        return this._ingest_endpoint_id;
    }

    get ingestEndpointRevisionId(): ObjectID {
        return this._revision_id;
    }

    get varType(): VarType {
        return this._var_type;
    }

    set varType(value: VarType) {
        this._var_type = value;
    }

    get childIngestEndpointDataMapIds(): ObjectID[] {
        return this._child_ingest_endpoint_data_map_ids;
    }

    set childIngestEndpointDataMapIds(value: ObjectID[]) {
        this._child_ingest_endpoint_data_map_ids = value;
    }

    get defaultValue(): DataMapValue | ScalarContainer<DataMapValue> | undefined {
        return this._default_value;
    }

    set defaultValue(value: DataMapValue | ScalarContainer<DataMapValue> | undefined) {
        this._default_value = value;
    }

    get isOptional(): boolean {
        return this._is_optional;
    }

    set isOptional(value: boolean) {
        this._is_optional = value;
    }

    get validations(): IngestEndpointDataMapValidation[] | undefined {
        return this._validations === undefined
            ? undefined
            : this._validations.arr.map((_) => JSON.parse(_));
    }

    set validations(value: IngestEndpointDataMapValidation[] | undefined) {
        const issues = S8ValidatorValidation.testValidationRules(value);
        if (issues.length > 0) {
            throw new GenericError(issues[0], LogPriority.DEBUG, true);
        }
        this._validations =
            value === undefined
                ? undefined
                : new ScalarContainer(...value.map((_) => JSON.stringify(_)));
    }
}
