/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VarType, InputType, TypeIcon, ValidationType, StorageProvider } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchAvailablePlatformActions
// ====================================================

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform {
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

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_validation_rules {
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

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps {
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
  validation_rules: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps {
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
  validation_rules: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers {
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
   * Description of the `PlatformDataContainer`
   */
  description: string;
  /**
   * A list of `PlatformDataMap` that describe the document style structure of this data layer
   */
  platform_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers_platform_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_validation_rules {
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

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps {
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
  validation_rules: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps {
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
  validation_rules: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions {
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
  platform_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions_platform_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform;
  /**
   * A list of data containers (data layers) that are associated with this `PlatformRevision`
   */
  platform_data_containers: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_data_containers[];
  /**
   * A list of actions that are associated with this `PlatformRevision`
   */
  platform_actions: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision_platform_actions[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions_platform_revision;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_revisions {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_environments {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
  /**
   * `Environment` name
   */
  name: string;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value = FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer | FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `IngestEndpointDataMap`
   */
  key: string;
  /**
   * Variable type (see `VarType`)
   */
  var_type: string;
  /**
   * Whether or not the property is optional or not
   */
  is_optional: boolean;
  /**
   * The default value. If no input is provided for this property, then the default value will be applied automatically
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `IngestEndpointDataMap`
   */
  key: string;
  /**
   * Variable type (see `VarType`)
   */
  var_type: string;
  /**
   * Whether or not the property is optional or not
   */
  is_optional: boolean;
  /**
   * The default value. If no input is provided for this property, then the default value will be applied automatically
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value | null;
  /**
   * If the variable type (see `VarType`) has been specified as an object or array of objects, then this contains the child property definitions
   */
  child_ingest_endpoint_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `IngestEndpointDataMap`
   */
  key: string;
  /**
   * Variable type (see `VarType`)
   */
  var_type: string;
  /**
   * Whether or not the property is optional or not
   */
  is_optional: boolean;
  /**
   * The default value. If no input is provided for this property, then the default value will be applied automatically
   */
  default_value: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value | null;
  /**
   * If the variable type (see `VarType`) has been specified as an object or array of objects, then this contains the child property definitions
   */
  child_ingest_endpoint_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * The `IngestEndpointDataMaps`s that construct the payload (key => value) configuration for the `IngestEndpointRevision`
   */
  ingest_endpoint_data_maps: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision_ingest_endpoint_data_maps[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments {
  __typename: "IngestEndpointEnvironment";
  /**
   * ID of the `IngestEndpointEnvironment`
   */
  id: string;
  /**
   * Name of the `IngestEndpointEnvironment`
   */
  name: string;
  /**
   * `IngestEndpointEnvironment`'s CNAME
   */
  cname: string;
  /**
   * A custom domain name associated with this `IngestEndpointEnvironment`
   */
  custom_domain: string | null;
  /**
   * `IngestEndpointEnvironment`'s install domain used to push data to
   */
  install_domain: string;
  /**
   * A hint of the credentials currently in use by the `IngestEndpointEnvironment`. For security reasons we don't enable to full retrival of this information via the API. It does not persist in our database or servers and remains in our vault.
   */
  config_hint: string;
  /**
   * The storage provider used by the `IngestEndpointEnvironment` to store ingested data
   */
  storage_provider: StorageProvider;
  /**
   * The `IngestEndpointRevision` currently bound to the `IngestEndpointEnvironment`
   */
  ingest_endpoint_revision: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments_ingest_endpoint_revision;
  /**
   * Date the `IngestEndpointEnvironment` was created
   */
  created_at: S8DateTime;
  /**
   * Date the `IngestEndpointEnvironment` last updated
   */
  updated_at: S8DateTime;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * Name of the `IngestEndpoint`
   */
  name: string;
  /**
   * The `IngestEndpointEnvironment`s owned by the `IngestEndpoint`
   */
  ingest_endpoint_environments: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints_ingest_endpoint_environments[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
  /**
   * A list of `IngestEndpoint`s linked to the `DataManagerAccount`
   */
  ingest_endpoints: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account_ingest_endpoints[];
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager account might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  data_manager_account: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account | null;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  org: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account_org;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision_app {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_revisions[];
  /**
   * Environments connected to the `App`. Environments are used to create a fixed deployment of a Revision
   */
  environments: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_environments[];
  /**
   * The `TagManagerAccount` that contains the `App`
   */
  tag_manager_account: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_tag_manager_account;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app_platform_revisions[];
  /**
   * App
   */
  app: FetchAvailablePlatformActions_getActionGroupDistribution_revision_app;
}

export interface FetchAvailablePlatformActions_getActionGroupDistribution {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
  /**
   * Revision
   */
  revision: FetchAvailablePlatformActions_getActionGroupDistribution_revision;
}

export interface FetchAvailablePlatformActions {
  /**
   * @bound=ActionGroupDistribution
   * Get a `ActionGroupDistribution` model from the `ActionGroupDistribution` ID
   */
  getActionGroupDistribution: FetchAvailablePlatformActions_getActionGroupDistribution;
}

export interface FetchAvailablePlatformActionsVariables {
  id: string;
}
