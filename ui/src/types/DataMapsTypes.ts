import { InputType, TypeIcon, ValidationType, VarType } from '../gql/generated/globalTypes';
import { IngestEndpointDataMap } from './IngestEndpointsTypes';

export type DataMapDefaultValueContainer = {
    __typename: 'DefaultValueContainer';
    value: S8DataMapValue | null;
};

export type DataMapDefaultValueContainerArray = {
    __typename: 'DefaultValueContainerArray';
    values: S8DataMapValue[] | null;
};

export type DataMapDefaultValue = DataMapDefaultValueContainer | DataMapDefaultValueContainerArray;

export type PlatformDataMapValidation = {
    input_value: S8DataMapValue | null;
    type: ValidationType;
};

export type PlatformDataMap = {
    __typename: 'PlatformDataMap';
    id: string;
    key: string;
    var_type: VarType;
    input_type: InputType;
    is_optional: boolean;
    icon?: TypeIcon | null;
    description: string;
    option_values: S8DataMapValue[] | null;
    validation_rules: PlatformDataMapValidation[] | null;
    default_value: DataMapDefaultValue | null;
    child_platform_data_maps: PlatformDataMap[];
};

export type DataMap = {
    __typename: 'DataMap';
    id: string;
    key: string;
    var_type: VarType;
    value: {
        value?: any;
        values?: any[];
        object?: DataMap[];
        objects?: DataMap[][];
    } | null;
};

export type DataContainer = {
    id: string;
    persisting_id: string;
    allow_custom: boolean;
    name: string;
    platform_data_maps: PlatformDataMap[];
    description: string;
    [key: string]: any;
};

export type DataMapsPayloadValues = {
    dataMap: IngestEndpointDataMap;
    include: boolean;
    parentKey: string | null;
    parentIndex: number;
    keyPath: string;
    values: S8DataMapValue[];
    objects: { children: DataMapsPayloadValues[] }[];
};

export type PlatformDataMapInput = {
    key: string;
    type: string;
    optional: boolean;
    description: string;
    validation_rules: PlatformDataMapValidation[] | undefined;
    option_values: S8DataMapValue[] | undefined;
    default_value: S8DataMapValue | undefined;
    default_values: S8DataMapValue[] | undefined;
    child_platform_data_maps: PlatformDataMapInput[];
};
