import Model from '../abstractions/Model';
import { CommandOperationOptions, ObjectId } from 'mongodb';
import DiffState from '../../enums/DiffState';
import ScalarContainer from '../custom/ScalarContainer';
import User from '../models/User';
import GQLMethod from '../../enums/GQLMethod';
import { ValidationType } from '../../../../common/enums/ValidationType';
import { VarType } from '../../enums/VarType';
import { InputType } from '../../../../common/enums/InputType';
import { TypeIcon } from '../../../../common/enums/TypeIcon';
import { DataMapValue } from '../../../../common/types/Types';

export type StorageProviderConfig = { config: { [k: string]: any }; hint: string };

export type PlatformDataMapValidation = {
    type: ValidationType;
    input_value?: DataMapValue;
};

export type IngestEndpointDataMapValidation = {
    type: ValidationType;
    input_value?: DataMapValue;
};

export type DataMapSchemaCheck = {
    platform_data_map_id: ObjectId;
    model_links?: {
        name: string;
        id: ObjectId;
    }[];
    valid: boolean;
    issue?: string;
};

export type OperationActor = User | 'SYSTEM';

export type SaveOptions = {
    user?: User;
    forceCreate?: boolean;
    mongoOptions?: CommandOperationOptions;
    gqlMethod?: GQLMethod;
    userComments?: string;
    opConnectedModels?: Model[];
};

//Used to created a new instance of some Model type
export type CT<U extends Model> = new (...args: any[]) => U;

export type ModelScalars = string | number | boolean | null | Date | ObjectId;
export type ModelType =
    | ModelScalars
    | ScalarContainer<string | number | boolean | Date>
    | ObjectId[]
    | Model
    | Model[];

export type MongoScalars = string | number | boolean | null | ObjectId | Date;
export type MongoType =
    | MongoScalars
    | ObjectId[]
    | MongoType[]
    | { [k: string]: MongoType }
    | { __arr: string[] | number[] | boolean[] | Date[] };
/*
    This is what we expose to GQL - objects are flat. Functions are used to expand the graph out and will return a flat structure
*/
export type GQLScalar = string | number | boolean | null | Date;
export type GQLType = { [k: string]: GQLScalar | GQLScalar[] };

export type ConfigType = { [k: string]: GQLScalar | GQLScalar[] | ConfigType | ConfigType[] };

export type Diff = { [k: string]: GQLScalar | Diff };

export type ModelDiffProp = {
    field: string;
    gqlField: string;
    left: GQLScalar | GQLScalar[];
    leftPlatformInstance: CT<Model> | null;
    right: GQLScalar | GQLScalar[];
    rightPlatformInstance: CT<Model> | null;
    allowPlatformAutoMerge: boolean;
    state: DiffState;
    ref: boolean;
};
export type ModelDiff = {
    model: string;
    id: string;
    left: Model | null;
    right: Model | null;
    state: DiffState;
    props: ModelDiffProp[];
    childrenModified: boolean;
};

export type JSONSafeDiffProp = {
    field: string;
    gqlField: string;
    left: Record<string, unknown> | null;
    right: Record<string, unknown> | null;
    state: DiffState;
    ref: boolean;
};
export type JSONSafeDiff = {
    model: string;
    id: string;
    left: string | null;
    right: string | null;
    state: DiffState;
    props: JSONSafeDiffProp[];
};

export type RevisionIssue = {
    model: string;
    modelId: string;
    gqlField?: string;
    issue: string;
};

// noinspection JSUnusedGlobalSymbols
export type PlatformDataMapSchema = {
    key: string;
    description: string;
    varType: VarType;
    inputType?: InputType;
    defaultValue?: DataMapValue | ScalarContainer<DataMapValue>;
    children?: PlatformDataMapSchema[];
    optional?: boolean;
    optionValues?: ScalarContainer<DataMapValue>;
};

export type DataMapSchema = {
    key: string;
    varType: VarType;
    value: DataMapValue | ScalarContainer<DataMapValue> | DataMapSchema[] | DataMapSchema[][];
};

export type IngestEndpointDataMapSchema = {
    key: string;
    varType: VarType;
    defaultValue?: DataMapValue | ScalarContainer<DataMapValue>;
    children?: IngestEndpointDataMapSchema[];
    optional?: boolean;
    validations?: IngestEndpointDataMapValidation[];
};

export type IngestEndpointDataMapValidationSchema = {
    parent: string | null;
    key: string;
    combined: string;
    type: VarType; //deprecated
    var_type: VarType;
    default: DataMapValue | DataMapValue[] | undefined; //deprecated
    default_value: DataMapValue | DataMapValue[] | undefined;
    required: boolean;
    repeated: boolean;
    validations: IngestEndpointDataMapValidation[];
};

export type BuildPlatformDataMapSchema = {
    key: string;
    description: string;
    persistence_id?: string;
    icon?: TypeIcon;
    input_type: InputType;
    default_value?: DataMapValue | ScalarContainer<DataMapValue>;
    child_platform_data_maps?: BuildPlatformDataMapSchema[];
    optional?: boolean;
    option_values?: ScalarContainer<DataMapValue>;
    validations?: PlatformDataMapValidation[];
};

export type BuildPlatformRevisionSchema = {
    name: string;
    settings?: BuildPlatformDataMapSchema[];
    events?: {
        persistence_id?: string;
        name: string;
        description: string;
        event: string;
        platform_data_maps?: BuildPlatformDataMapSchema[];
        icon?: TypeIcon;
    }[];
    data_containers?: {
        persistence_id?: string;
        name: string;
        description: string;
        allow_custom?: boolean;
        platform_data_maps?: BuildPlatformDataMapSchema[];
        icon?: TypeIcon;
    }[];
    actions?: {
        persistence_id?: string;
        name: string;
        description: string;
        s2s_endpoint?: string;
        platform_data_maps?: BuildPlatformDataMapSchema[];
        icon?: TypeIcon;
    }[];
    assets?: {
        persistence_id?: string;
        name: string;
        mime_type: string;
        is_primary: boolean;
    }[];
    publish?: boolean;
};
