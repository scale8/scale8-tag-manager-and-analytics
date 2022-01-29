/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ConditionType, TypeIcon, VarType, InputType, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UpdateConditionRuleGetData
// ====================================================

export interface UpdateConditionRuleGetData_getConditionRule_match_CustomMatch {
  __typename: "CustomMatch";
  /**
   * The data key to match against
   */
  custom_key: string;
}

export interface UpdateConditionRuleGetData_getConditionRule_match_PlatformDataMap {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
}

export type UpdateConditionRuleGetData_getConditionRule_match = UpdateConditionRuleGetData_getConditionRule_match_CustomMatch | UpdateConditionRuleGetData_getConditionRule_match_PlatformDataMap;

export interface UpdateConditionRuleGetData_getConditionRule_platform_data_container_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
}

export interface UpdateConditionRuleGetData_getConditionRule_platform_data_container {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * `Platform` that contains this `PlatformDataContainer`
   */
  platform: UpdateConditionRuleGetData_getConditionRule_platform_data_container_platform;
}

export interface UpdateConditionRuleGetData_getConditionRule {
  __typename: "ConditionRule";
  /**
   * `ConditionRule` ID
   */
  id: string;
  /**
   * `ConditionRule` name
   */
  name: string;
  /**
   * `ConditionRule` type, see `ConditionMatch` enum.
   */
  match: UpdateConditionRuleGetData_getConditionRule_match;
  /**
   * Match condition, see `ConditionType` enum.
   */
  match_condition: ConditionType;
  /**
   * Match value (see `DataMapValue`), the value to match againt data property key specificed by `ConditionMatch`.
   */
  match_value: S8DataMapValue;
  /**
   * Match key (used on object types)
   */
  match_key: string | null;
  /**
   * The `PlatformDataContainer` to match against
   */
  platform_data_container: UpdateConditionRuleGetData_getConditionRule_platform_data_container;
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform {
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

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_validation_rules {
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

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value = UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainer | UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value = UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps {
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
  validation_rules: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps {
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
  validation_rules: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * Persisting ID, this reference will stay the same across all revisions of this entity
   */
  persisting_id: string;
  /**
   * Whether or not to allow custom keys to be defined by the user to access properties within this data layer
   */
  allow_custom: boolean;
  /**
   * Name of the `PlatformDataContainer`
   */
  name: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Description of the `PlatformDataContainer`
   */
  description: string;
  /**
   * A list of `PlatformDataMap` that describe the document style structure of this data layer
   */
  platform_data_maps: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps[];
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform;
  /**
   * A list of data containers (data layers) that are associated with this `PlatformRevision`
   */
  platform_data_containers: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_data_containers[];
}

export interface UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions_platform_revision;
}

export interface UpdateConditionRuleGetData_getTrigger_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: UpdateConditionRuleGetData_getTrigger_revision_app_platform_revisions[];
}

export interface UpdateConditionRuleGetData_getTrigger {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * Revision
   */
  revision: UpdateConditionRuleGetData_getTrigger_revision;
}

export interface UpdateConditionRuleGetData {
  /**
   * @bound=ConditionRule
   * Get a `ConditionRule` model from the `ConditionRule` ID
   */
  getConditionRule: UpdateConditionRuleGetData_getConditionRule;
  /**
   * @bound=Trigger
   * Get a `Trigger` model from the `Trigger` ID
   */
  getTrigger: UpdateConditionRuleGetData_getTrigger;
}

export interface UpdateConditionRuleGetDataVariables {
  conditionId: string;
  triggerId: string;
}
