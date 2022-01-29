/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VarType, InputType, TypeIcon, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FetchAppPlatformRevisionData
// ====================================================

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject_object[];
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects_objects[][];
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapValueContainerArray | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObject | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value_DataMapObjects;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject_object[];
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject_object[];
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects_objects[][];
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapValueContainerArray | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObject | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value_DataMapObjects;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects_objects[][];
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapValueContainerArray | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObject | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value_DataMapObjects;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings {
  __typename: "DataMap";
  /**
   * `DataMap` ID
   */
  id: string;
  /**
   * `DataMap` key
   */
  key: string;
  /**
   * `DataMap` variable type (string, int, boolean, array of strings, object etc.)
   */
  var_type: VarType;
  /**
   * `DataMap` value
   */
  value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_validation_rules {
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

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_default_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_default_value_DefaultValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_default_value_DefaultValueContainerArray;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_validation_rules {
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

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value = FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps {
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
  validation_rules: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps_child_platform_data_maps[];
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings {
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
  validation_rules: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings_child_platform_data_maps[];
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions {
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
  platform_settings: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions_platform_settings[];
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform {
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
  platform_revisions: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform_platform_revisions[];
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision_platform;
}

export interface FetchAppPlatformRevisionData_getAppPlatformRevision {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `DataMap` that implements platform settings and currently attached to this `AppPlatformRevision`
   */
  platform_settings: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_settings[];
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: FetchAppPlatformRevisionData_getAppPlatformRevision_platform_revision;
}

export interface FetchAppPlatformRevisionData {
  /**
   * @bound=AppPlatformRevision
   * Get an `AppPlatformRevision` model from `AppPlatformRevision` ID
   */
  getAppPlatformRevision: FetchAppPlatformRevisionData_getAppPlatformRevision;
}

export interface FetchAppPlatformRevisionDataVariables {
  id: string;
}
