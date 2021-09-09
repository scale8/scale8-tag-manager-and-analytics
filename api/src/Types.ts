import { ValidationType } from '../../common/enums/ValidationType';
import { InputType } from '../../common/enums/InputType';
import { TypeIcon } from '../../common/enums/TypeIcon';

export interface PlatformEventConfig {
    persistence_id: string;
    icon?: TypeIcon;
    name: string;
    description: string;
    data?: PlatformDataMapConfig[];
}
export interface PlatformDataContainerConfig {
    persistence_id: string;
    icon?: TypeIcon;
    name: string;
    description: string;
    allow_custom?: boolean;
    data?: PlatformDataMapConfig[];
}
export interface PlatformActionConfig {
    persistence_id: string;
    icon?: TypeIcon;
    name: string;
    description: string;
    data?: PlatformDataMapConfig[];
}
export interface PlatformDataMapValidationConfig {
    type: ValidationType;
    min?: number;
    max?: number;
    regex?: string;
}
export interface PlatformDataMapConfig {
    persistence_id: string;
    icon?: TypeIcon;
    key: string;
    description?: string;
    input_type: InputType;
    default_value?: string | number | boolean | string[] | number[] | boolean[];
    option_values?: string[] | number[] | boolean[];
    children?: PlatformDataMapConfig[];
    optional?: boolean;
    validation_rules?: PlatformDataMapValidationConfig[];
}
export interface PlatformRevisionConfig {
    actions?: PlatformActionConfig[];
    events?: PlatformEventConfig[];
    data_containers?: PlatformDataContainerConfig[];
}
