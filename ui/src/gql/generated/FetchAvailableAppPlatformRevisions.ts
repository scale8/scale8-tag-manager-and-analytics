/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VarType, InputType, TypeIcon, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchAvailableAppPlatformRevisions
// ====================================================

export interface FetchAvailableAppPlatformRevisions_getRevision_app_platform_revisions_platform_revision_platform {
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

export interface FetchAvailableAppPlatformRevisions_getRevision_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The name of the `PlatformRevision`
   */
  name: string;
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: FetchAvailableAppPlatformRevisions_getRevision_app_platform_revisions_platform_revision_platform;
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: FetchAvailableAppPlatformRevisions_getRevision_app_platform_revisions_platform_revision;
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_validation_rules {
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

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_default_value = FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_default_value_DefaultValueContainer | FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_default_value_DefaultValueContainerArray;

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_validation_rules {
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

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value = FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value = FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps {
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
  validation_rules: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings {
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
  validation_rules: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings_child_platform_data_maps[];
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The name of the `PlatformRevision`
   */
  name: string;
  /**
   * Whether or not the `PlatformRevision` has been locked or not. When locked no
   * future changes can be made to the `PlatformRevision` or any of its connected entities
   */
  locked: boolean;
  /**
   * A list of `PlatformDataMap`s that create a document style container of key => value pairs
   */
  platform_settings: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions_platform_settings[];
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
  /**
   * `PlatformRevision`s the are linked to this `Platform`. Please note that if the
   * `Platform` has been made public and `PlatformRevision` has been published, it
   * will be avalible to ***any*** Scale8 Tag Manager User to install in their `App`
   */
  platform_revisions: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform_platform_revisions[];
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms {
  __typename: "AppPlatform";
  /**
   * `Platform` that is currently linked to this `AppPlatform`
   */
  platform: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms_platform;
}

export interface FetchAvailableAppPlatformRevisions_getRevision_app {
  __typename: "App";
  /**
   * All the platforms that a user has connected to (installed on) the `App`. The
   * is the master connected list that will appear in revised models.
   */
  app_platforms: FetchAvailableAppPlatformRevisions_getRevision_app_app_platforms[];
}

export interface FetchAvailableAppPlatformRevisions_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: FetchAvailableAppPlatformRevisions_getRevision_app_platform_revisions[];
  /**
   * App
   */
  app: FetchAvailableAppPlatformRevisions_getRevision_app;
}

export interface FetchAvailableAppPlatformRevisions {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: FetchAvailableAppPlatformRevisions_getRevision;
}

export interface FetchAvailableAppPlatformRevisionsVariables {
  id: string;
}
