import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import Revision from './Revision';
import ScalarContainer from '../../custom/ScalarContainer';
import RepeatedDataMap from './RepeatedDataMap';
import DataError from '../../../errors/DataError';
import DataMapRepo from '../../repos/tag/DataMapRepo';
import RepeatedDataMapRepo from '../../repos/tag/RepeatedDataMapRepo';
import S8DateTime from '../../../core/S8DateTime';
import userMessages from '../../../errors/UserMessages';
import { VarType } from '../../../enums/VarType';
import { DataMapValue } from '../../../../../common/types/Types';

export default class DataMap extends Model {
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
    private readonly _name: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'key',
        validation: (_) => _.match(/^[a-z_]+[a-z0-9_]*$/) !== null,
        exposeToConfig: true,
    })
    private readonly _key: string;

    @Field<DataMapValue | ScalarContainer<DataMapValue>>({
        exposeToGQLAs: 'value',
        exposeToConfig: true,
    })
    private readonly _value?: DataMapValue | ScalarContainer<DataMapValue>;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'var_type',
        exposeToConfig: true,
    })
    private readonly _var_type: VarType;

    @Field<ObjectID[]>({
        repository: DataMapRepo,
        required: true,
        exposeToGQLAs: 'child_data_map_ids',
        exposeToConfig: true,
    })
    private readonly _child_data_map_ids: ObjectID[] = [];

    @Field<ObjectID[]>({
        repository: RepeatedDataMapRepo,
        required: true,
        exposeToGQLAs: 'repeated_data_map_ids',
        exposeToConfig: true,
    })
    private readonly _repeated_data_map_ids: ObjectID[] = [];

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private readonly _app_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'revision_id',
    })
    private readonly _revision_id!: ObjectID;

    constructor(
        key: string,
        varType: VarType,
        revision: Revision,
        value: DataMapValue | ScalarContainer<DataMapValue> | DataMap[] | RepeatedDataMap[],
    ) {
        super();
        this._key = key;
        this._var_type = varType;
        this._name = key;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
        }
        if (value !== undefined) {
            if (
                varType === VarType.DATETIME &&
                typeof value === 'string' &&
                S8DateTime.isValidDateTime(value)
            ) {
                this._value = value;
            } else if (
                varType === VarType.TIMESTAMP &&
                typeof value === 'number' &&
                S8DateTime.isValidTimestamp(value)
            ) {
                this._value = value;
            } else if (varType === VarType.STRING && typeof value === 'string') {
                this._value = value;
            } else if (
                varType === VarType.INT &&
                typeof value === 'number' &&
                Number.isInteger(value)
            ) {
                this._value = value;
            } else if (varType === VarType.FLOAT && typeof value === 'number') {
                this._value = value;
            } else if (varType === VarType.BOOLEAN && typeof value === 'boolean') {
                this._value = value;
            } else if (
                varType === VarType.ARRAY_STRING &&
                value instanceof ScalarContainer &&
                value.arr.every((_) => typeof _ === 'string')
            ) {
                this._value = value;
            } else if (
                varType === VarType.ARRAY_INT &&
                value instanceof ScalarContainer &&
                value.arr.every((_) => typeof _ === 'number' && Number.isInteger(_))
            ) {
                this._value = value;
            } else if (
                varType === VarType.ARRAY_FLOAT &&
                value instanceof ScalarContainer &&
                value.arr.every((_) => typeof _ === 'number')
            ) {
                this._value = value;
            } else if (
                varType === VarType.OBJECT &&
                Array.isArray(value) &&
                (value as any[]).every((_) => _ instanceof DataMap)
            ) {
                //check to make sure keys at this level are unique...
                const dataMaps = value as DataMap[];
                const keyCount = dataMaps
                    .map((_) => _.key)
                    .reduce((m, k) => {
                        const entry = m.get(k);
                        m.set(k, entry === undefined ? 1 : entry + 1);
                        return m;
                    }, new Map<string, number>());
                keyCount.forEach((v, k) => {
                    if (v > 1) {
                        throw new DataError(userMessages.dataMapKeyDuplicate(k), true);
                    }
                });
                this._child_data_map_ids = dataMaps.map((_) => _.id);
            } else if (
                varType === VarType.ARRAY_OBJECT &&
                Array.isArray(value) &&
                (value as any[]).every((_) => _ instanceof RepeatedDataMap)
            ) {
                this._repeated_data_map_ids = (value as RepeatedDataMap[]).map((_) => _.id);
            } else {
                throw new DataError(userMessages.varTypeMismatch(varType, value.toString()), true);
            }
        }
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get name(): string {
        return this._name;
    }

    get key(): string {
        return this._key;
    }

    get varType(): VarType {
        return this._var_type;
    }

    get value(): DataMapValue | ScalarContainer<DataMapValue> | undefined {
        return this._value;
    }

    get childDataMapIds(): ObjectID[] {
        return this._child_data_map_ids;
    }

    get repeatedDataMapIds(): ObjectID[] {
        return this._repeated_data_map_ids;
    }

    get revisionId(): ObjectID {
        return this._revision_id;
    }
}
