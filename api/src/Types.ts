import { ValidationType } from '../../common/enums/ValidationType';
import { InputType } from '../../common/enums/InputType';
import { TypeIcon } from '../../common/enums/TypeIcon';
import { AwsRegion } from './enums/AwsRegion';
import { JWTInput } from 'google-auth-library/build/src/auth/credentials';

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
export interface AwsConfig {
    access_key_id: string;
    secret_access_key: string;
    region: AwsRegion;
    path_prefix: string;
    bucket_name: string;
}
export interface GCBigQueryStreamConfig {
    service_account_json: JWTInput;
    data_set_name: string;
    data_set_location: 'EU' | 'US';
    require_partition_filter_in_queries: boolean;
}
export interface MongoDbPushConfig {
    use_api_mongo_server: boolean;
    connection_string: string;
    database_name: string;
}
