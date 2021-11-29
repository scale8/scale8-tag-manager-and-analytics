/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TypeIcon, VarType, InputType, ValidationType, PlatformActionPermissionRequest, PlatformActionPermissionURLParts } from "./globalTypes";

// ====================================================
// GraphQL query operation: UpdateTemplatedActionGetData
// ====================================================

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_validation_rules {
  __typename: "PlatformDataMapValidation";
  /**
   * Validation type
   */
  type: ValidationType;
  /**
   * Input value to check against
   */
  input_value: S8DataMapValue | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_default_value = UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_default_value_DefaultValueContainer | UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_validation_rules {
  __typename: "PlatformDataMapValidation";
  /**
   * Validation type
   */
  type: ValidationType;
  /**
   * Input value to check against
   */
  input_value: S8DataMapValue | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_default_value = UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
  __typename: "PlatformDataMapValidation";
  /**
   * Validation type
   */
  type: ValidationType;
  /**
   * Input value to check against
   */
  input_value: S8DataMapValue | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `PlatformDataMap`
   */
  key: string;
  /**
   * See `VarType`
   */
  var_type: VarType;
  /**
   * See `InputType`
   */
  input_type: InputType;
  /**
   * Description of the `PlatformDataMap`
   */
  description: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to
   * provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `PlatformDataMap`
   */
  key: string;
  /**
   * See `VarType`
   */
  var_type: VarType;
  /**
   * See `InputType`
   */
  input_type: InputType;
  /**
   * Description of the `PlatformDataMap`
   */
  description: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to
   * provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `PlatformDataMap`
   */
  key: string;
  /**
   * See `VarType`
   */
  var_type: VarType;
  /**
   * See `InputType`
   */
  input_type: InputType;
  /**
   * Description of the `PlatformDataMap`
   */
  description: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to
   * provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateTemplatedActionGetData_getPlatformAction_permissions_requests_variable_read_write_execute_scopes {
  __typename: "VariableReadWriteExecuteScope";
  /**
   * Variable name
   */
  name: string;
  /**
   * Can read variable?
   */
  read: boolean;
  /**
   * Can modify variable?
   */
  write: boolean;
  /**
   * Can execute variable?
   */
  execute: boolean;
}

export interface UpdateTemplatedActionGetData_getPlatformAction_permissions_requests {
  __typename: "PlatformActionPermission";
  /**
   * ID of the `PlatformActionPermission`
   */
  id: string;
  /**
   * Permission required
   */
  permission: PlatformActionPermissionRequest;
  /**
   * List of variable read/write scopes, if applicable to this permission
   */
  variable_read_write_execute_scopes: UpdateTemplatedActionGetData_getPlatformAction_permissions_requests_variable_read_write_execute_scopes[] | null;
  /**
   * List of url parts accessible by this permission, if applicable
   */
  url_parts: PlatformActionPermissionURLParts[] | null;
  /**
   * List of host matches, if applicable to this permission
   */
  host_matches: string[] | null;
  /**
   * List of event names, if applicable to this permission
   */
  event_names: string[] | null;
}

export interface UpdateTemplatedActionGetData_getPlatformAction {
  __typename: "PlatformAction";
  /**
   * ID of the `PlatformAction`
   */
  id: string;
  /**
   * Name of the `PlatformAction`
   */
  name: string;
  /**
   * Description of the `PlatformAction`
   */
  description: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Code, if applicable and running in templated mode.
   */
  code: string | null;
  /**
   * If the code should be executed in an iframe, bypassing the sandbox and effectively executing as raw code.
   */
  exec_raw_in_iframe: boolean;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This
   * can be directly accessed by the action when called.
   */
  platform_data_maps: UpdateTemplatedActionGetData_getPlatformAction_platform_data_maps[];
  /**
   * List of `PlatformActionPermission`s linked to this action
   */
  permissions_requests: UpdateTemplatedActionGetData_getPlatformAction_permissions_requests[];
}

export interface UpdateTemplatedActionGetData {
  /**
   * @bound=PlatformAction
   * Method will return a `PlatformAction` instance from its ID.
   */
  getPlatformAction: UpdateTemplatedActionGetData_getPlatformAction;
}

export interface UpdateTemplatedActionGetDataVariables {
  id: string;
}
