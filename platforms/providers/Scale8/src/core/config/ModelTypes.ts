import { RefId } from '../../../../../common/models/RefId';
import {
    ActionGroupDistributionType,
    ConditionType,
    PlatformActionPermissionRequest,
    PlatformActionPermissionURLParts,
    PlatformType,
    TagType,
    VarType,
} from '../../../../../common/enums/Enums';

export type Model =
    | 'PlatformDataContainer'
    | 'PlatformAsset'
    | 'PlatformEvent'
    | 'PlatformAction'
    | 'PlatformActionPermission'
    | 'PlatformDataMap'
    | 'PlatformRevision'
    | 'Platform'
    | 'Action'
    | 'ActionGroup'
    | 'ActionGroupDistribution'
    | 'ConditionRule'
    | 'DataMap'
    | 'Revision'
    | 'Tag'
    | 'AppPlatformRevision'
    | 'RepeatedDataMap'
    | 'Event'
    | 'Rule'
    | 'Trigger'
    | 'RuleGroup';

export type BaseModel = {
    _id: RefId;
    ___persisting_id: string;
    ___type: Model;
};

export type BasePlatformRevisionModel = BaseModel & {
    _platform_id: RefId;
    _revision_id: RefId;
};

export type PlatformDataContainer = {
    _allow_custom: boolean;
    _platform_data_map_ids: RefId[];
} & BasePlatformRevisionModel;

// export type PlatformAsset = {
//     _mime_type: string;
//     _is_primary: boolean;
// } & BasePlatformRevisionModel;

export type PlatformEvent = {
    _event: string;
    _platform_data_map_ids: RefId[];
} & BasePlatformRevisionModel;

export type PlatformAction = {
    _s2s_endpoint: string | null;
    _code: string | null;
    _platform_data_map_ids: RefId[];
    _platform_action_permission_ids: RefId[];
    _exec_raw_in_iframe: boolean;
} & BasePlatformRevisionModel;

export type PlatformActionPermission = {
    _permission: PlatformActionPermissionRequest;
    _variable_read_write_execute_scopes: string[] | null;
    _url_parts: PlatformActionPermissionURLParts[] | null;
    _host_matches: string[] | null;
    _event_names: string[] | null;
} & BasePlatformRevisionModel;

export type PlatformDataMap = {
    _key: string;
    _var_type: VarType;
    _option_values: (string | number | boolean)[];
    _default_value: any;
    _child_platform_data_map_ids: RefId[];
} & BasePlatformRevisionModel;

export type PlatformRevision = {
    _platform_id: RefId;
    _platform_setting_ids: RefId[];
    _platform_asset_ids: RefId[];
    _platform_event_ids: RefId[];
    _platform_data_container_ids: RefId[];
    _platform_action_ids: RefId[];
    _is_final: boolean;
    _is_published: boolean;
} & BaseModel;

export type Platform = {
    _type: PlatformType;
    _is_core: boolean;
    _is_public: boolean;
} & BaseModel;

export type Action = {
    _platform_action_id: RefId;
    _data_map_ids: RefId[];
} & BaseModel;

export type ActionGroup = {
    _action_ids: RefId[];
    _distribution: number;
    _is_locked: boolean;
} & BaseModel;

export type ActionGroupDistribution = {
    _parent_type: 'REVISION' | 'RULE';
    _action_group_distribution_type: ActionGroupDistributionType;
    _action_group_ids: RefId[];
} & BaseModel;

export type ConditionRule = {
    _platform_data_container_id: RefId;
    _match: string | RefId;
    _match_key?: string;
    _match_condition: ConditionType;
    _match_value: any;
} & BaseModel;

export type DataMap = {
    _key: string;
    _value: any;
    _var_type: VarType;
    _child_data_map_ids: RefId[];
    _repeated_data_map_ids: RefId[];
} & BaseModel;

// export type Revision = {
//     _app_platform_revision_ids: RefId[];
//     _tag_ids: RefId[];
//     _global_trigger_ids: RefId[];
//     _global_action_group_distribution_ids: RefId[];
// } & BaseModel;

export type Tag = {
    _tag_code: string;
    _type: TagType;
    _width: number;
    _height: number;
    _is_active: boolean;
    _auto_load: boolean;
    _rule_group_ids: RefId[];
} & BaseModel;

// export type AppPlatformRevision = {
//     _platform_revision_id: RefId;
//     _platform_settings_data_map_ids: RefId[];
// } & BaseModel;

export type RepeatedDataMap = {
    _repeated_child_data_map_ids: RefId[];
} & BaseModel;

export type Event = {
    _event: string | RefId;
    _data_map_ids: RefId[];
    _clear_state_ms: number;
} & BaseModel;

export type Rule = {
    _custom_trigger_id?: RefId;
    _global_trigger_id?: string;
    _custom_action_group_distribution_ids: RefId[];
    _global_action_group_distribution_ids: string[];
    _action_group_order: string[];
    _is_active: boolean;
    _min_repeat_interval: number;
} & BaseModel;

export type Trigger = {
    _parent_type: 'REVISION' | 'RULE';
    _event_ids: RefId[];
    _condition_rule_ids: RefId[];
    _exception_rule_ids: RefId[];
} & BaseModel;

export type RuleGroup = {
    _is_active: boolean;
    _rule_ids: RefId[];
} & BaseModel;
