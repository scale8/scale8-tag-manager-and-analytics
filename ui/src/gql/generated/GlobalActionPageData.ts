/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RevisionEntityParentType, ActionGroupDistributionType, TypeIcon, VarType, InputType, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GlobalActionPageData
// ====================================================

export interface GlobalActionPageData_getActionGroupDistribution_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_validation_rules {
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

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_default_value = GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_default_value_DefaultValueContainer | GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_default_value_DefaultValueContainerArray;

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_default_value = GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps {
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
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps {
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
   * Option value - used when `PlatformDataMap` is a SELECT or RADIO `InputType` to provide a complete list of values to choose from
   */
  option_values: S8DataMapValue[] | null;
  /**
   * A list of validation rules associated with this `PlatformDataMap`.
   */
  validation_rules: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps_child_platform_data_maps[];
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action {
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
   * List of `PlatformDataMap`s that create a document style key => value map. This can be directly accessed by the action when called.
   */
  platform_data_maps: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform_data_maps[];
  /**
   * `Platform` that contains this `PlatformAction`
   */
  platform: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action_platform;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups_actions {
  __typename: "Action";
  /**
   * `Action` ID
   */
  id: string;
  /**
   * `Action` name
   */
  name: string;
  /**
   * `PlatformAction` that this `Action` implements
   */
  platform_action: GlobalActionPageData_getActionGroupDistribution_action_groups_actions_platform_action;
}

export interface GlobalActionPageData_getActionGroupDistribution_action_groups {
  __typename: "ActionGroup";
  /**
   * `ActionGroup` ID
   */
  id: string;
  /**
   * `ActionGroup` name
   */
  name: string;
  /**
   * `Action`'s linked to this `ActionGroup`
   */
  actions: GlobalActionPageData_getActionGroupDistribution_action_groups_actions[];
  /**
   * Distribution value. -1 = Not distributed. Value is between -1 and 1000 inclusive.
   */
  distribution: number;
  /**
   * If the distribution of this `ActionGroup` is locked
   */
  is_locked: boolean;
}

export interface GlobalActionPageData_getActionGroupDistribution {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
  /**
   * `ActionGroupDistribution` name
   */
  name: string;
  /**
   * Type of entity this model is bound to
   */
  parent_type: RevisionEntityParentType;
  /**
   * `ActionGroupDistribution` distribution type (see `ActionGroupDistributionType`)
   */
  action_group_distribution_type: ActionGroupDistributionType;
  /**
   * Revision
   */
  revision: GlobalActionPageData_getActionGroupDistribution_revision;
  /**
   * `ActionGroup`'s associated with this `ActionGroupDistribution`
   */
  action_groups: GlobalActionPageData_getActionGroupDistribution_action_groups[];
}

export interface GlobalActionPageData {
  /**
   * @bound=ActionGroupDistribution
   * Get a `ActionGroupDistribution` model from the `ActionGroupDistribution` ID
   */
  getActionGroupDistribution: GlobalActionPageData_getActionGroupDistribution;
}

export interface GlobalActionPageDataVariables {
  id: string;
}
