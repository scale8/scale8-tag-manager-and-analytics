import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { PlatformDataMapValidation } from '../../types/Types';
import { ObjectId } from 'mongodb';
import PlatformRevision from './PlatformRevision';
import ScalarContainer from '../../custom/ScalarContainer';
import PlatformDataMapRepo from '../../repos/tag/PlatformDataMapRepo';
import S8VarTypeValidation from '../../../core/S8VarTypeValidation';
import GenericError from '../../../errors/GenericError';
import S8ValidatorValidation from '../../../core/S8ValidatorValidation';
import { VarType } from '../../../enums/VarType';
import { LogPriority } from '../../../enums/LogPriority';
import { InputType } from '../../../../../common/enums/InputType';
import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { DataMapValue } from '../../../../../common/types/Types';

export default class PlatformDataMap extends Model {
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

    @Field<string>({
        required: true,
        exposeToGQLAs: 'description',
        platformAutoMerge: true, //change in name here will not cause any conflicts in behaviour
    })
    private _description: string;

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
        required: true,
        exposeToGQLAs: 'key',
        validation: (_) => _.match(/^[a-z_]+[a-z0-9_]*$/) !== null,
        exposeToConfig: true,
    })
    private _key: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'input_type',
    })
    private _input_type: InputType;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'var_type',
        exposeToConfig: true,
    })
    private _var_type: VarType;

    @Field<ScalarContainer<DataMapValue>>({
        exposeToGQLAs: 'option_values',
        exposeToConfig: true,
    })
    private _option_values?: ScalarContainer<DataMapValue>;

    @Field<DataMapValue | ScalarContainer<DataMapValue>>({
        exposeToGQLAs: 'default_value',
        exposeToConfig: true,
    })
    private _default_value?: DataMapValue | ScalarContainer<DataMapValue>;

    @Field<ObjectId[]>({
        repository: PlatformDataMapRepo,
        required: true,
        exposeToGQLAs: 'child_platform_data_map_ids',
        exposeToConfig: true,
    })
    private _child_platform_data_map_ids: ObjectId[] = [];

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'is_optional',
    })
    private _is_optional: boolean;

    @Field<TypeIcon>({
        required: false,
        exposeToGQLAs: 'icon',
    })
    private _icon?: TypeIcon;

    @Field<ScalarContainer<string>>({
        required: false,
        exposeToGQLAs: 'validations',
    })
    private _validations?: ScalarContainer<string>;

    constructor(
        key: string,
        description: string,
        platformRevision: PlatformRevision,
        varType: VarType,
        inputType: InputType,
        childPlatformDataMaps: PlatformDataMap[] = [], //used for creating document style points
        defaultValue?: DataMapValue | ScalarContainer<DataMapValue>,
        isOptional = true,
        optionValues?: ScalarContainer<DataMapValue>,
        icon?: TypeIcon,
        validations?: PlatformDataMapValidation[],
    ) {
        super();
        this._name = key;
        this._key = key;
        this._description = description;
        if (platformRevision !== undefined) {
            this._org_id = platformRevision.orgId;
            this._tag_manager_account_id = platformRevision.tagManagerAccountId;
            this._platform_id = platformRevision.platformId;
            this._revision_id = platformRevision.id;
        }
        this._var_type = varType;
        this._input_type = inputType; //todo. should we even check this?
        if (varType === VarType.ARRAY_OBJECT || varType === VarType.OBJECT) {
            this._child_platform_data_map_ids = childPlatformDataMaps.map((_) => _.id);
        } else if (S8VarTypeValidation.checkVarTypeAndDefaultValueAlign(varType, defaultValue)) {
            this._default_value = defaultValue;
        }
        this._is_optional = isOptional || defaultValue !== undefined;
        this._option_values = optionValues;
        this._icon = icon;
        this.validations = validations;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._name = value;
        this._key = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
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

    get varType(): VarType {
        return this._var_type;
    }

    set varType(value: VarType) {
        this._var_type = value;
    }

    get inputType(): InputType {
        return this._input_type;
    }

    set inputType(value: InputType) {
        this._input_type = value;
    }

    get childPlatformDataMapIds(): ObjectId[] {
        return this._child_platform_data_map_ids;
    }

    set childPlatformDataMapIds(value: ObjectId[]) {
        this._child_platform_data_map_ids = value;
    }

    get defaultValue(): DataMapValue | ScalarContainer<DataMapValue> | undefined {
        return this._default_value;
    }

    set defaultValue(value: DataMapValue | ScalarContainer<DataMapValue> | undefined) {
        if (S8VarTypeValidation.checkVarTypeAndDefaultValueAlign(this.varType, value)) {
            this._default_value = value;
        } else {
            throw new GenericError('VarType and DefaultValue do not align', LogPriority.DEBUG);
        }
    }

    get optionValues(): ScalarContainer<DataMapValue> | undefined {
        return this._option_values;
    }

    set optionValues(value: ScalarContainer<DataMapValue> | undefined) {
        this._option_values = value;
    }

    get isOptional(): boolean {
        return this._is_optional;
    }

    set isOptional(value: boolean) {
        this._is_optional = value;
    }

    get icon(): TypeIcon | undefined {
        return this._icon;
    }

    set icon(value: TypeIcon | undefined) {
        this._icon = value;
    }

    get validations(): PlatformDataMapValidation[] | undefined {
        return this._validations === undefined
            ? undefined
            : this._validations.arr.map((_) => JSON.parse(_));
    }

    set validations(value: PlatformDataMapValidation[] | undefined) {
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
