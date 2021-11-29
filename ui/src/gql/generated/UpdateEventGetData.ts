/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TypeIcon, VarType, InputType, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UpdateEventGetData
// ====================================================

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform {
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

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_validation_rules {
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

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value = UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainer | UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value = UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps {
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
  validation_rules: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps {
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
  validation_rules: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events {
  __typename: "PlatformEvent";
  /**
   * ID of the `PlatformEvent`
   */
  id: string;
  /**
   * Name of the `PlatformEvent`
   */
  name: string;
  /**
   * Icon
   */
  icon: TypeIcon | null;
  /**
   * Description of the `PlatformEvent`
   */
  description: string;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This
   * can be directly accessed by the event when called.
   */
  platform_data_maps: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events_platform_data_maps[];
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform;
  /**
   * A list of events that are associated with this `PlatformRevision`
   */
  platform_events: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision_platform_events[];
}

export interface UpdateEventGetData_getTrigger_revision_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: UpdateEventGetData_getTrigger_revision_app_platform_revisions_platform_revision;
}

export interface UpdateEventGetData_getTrigger_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: UpdateEventGetData_getTrigger_revision_app_platform_revisions[];
}

export interface UpdateEventGetData_getTrigger {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * Revision
   */
  revision: UpdateEventGetData_getTrigger_revision;
}

export interface UpdateEventGetData_getEvent_event_CustomEvent {
  __typename: "CustomEvent";
  /**
   * The name of the event to listen for.
   */
  custom_name: string;
}

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform {
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

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_validation_rules {
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

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_default_value = UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainer | UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value = UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps {
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
  validation_rules: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps {
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
  validation_rules: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps[];
}

export interface UpdateEventGetData_getEvent_event_PlatformEvent {
  __typename: "PlatformEvent";
  /**
   * ID of the `PlatformEvent`
   */
  id: string;
  /**
   * Name of the `PlatformEvent`
   */
  name: string;
  /**
   * Description of the `PlatformEvent`
   */
  description: string;
  /**
   * `Platform` that contains this `PlatformEvent`
   */
  platform: UpdateEventGetData_getEvent_event_PlatformEvent_platform;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This
   * can be directly accessed by the event when called.
   */
  platform_data_maps: UpdateEventGetData_getEvent_event_PlatformEvent_platform_data_maps[];
}

export type UpdateEventGetData_getEvent_event = UpdateEventGetData_getEvent_event_CustomEvent | UpdateEventGetData_getEvent_event_PlatformEvent;

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value = UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject | UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer | UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object {
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
  value: UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object[];
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value = UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject | UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer | UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects {
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
  value: UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects[][];
}

export type UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value = UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainer | UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainerArray | UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject | UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects;

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object {
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
  value: UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object_value | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: UpdateEventGetData_getEvent_data_maps_value_DataMapObject_object[];
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value = UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object {
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
  value: UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object[];
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value = UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects {
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
  value: UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects[][];
}

export type UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value = UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainer | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainerArray | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects;

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects {
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
  value: UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects_value | null;
}

export interface UpdateEventGetData_getEvent_data_maps_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: UpdateEventGetData_getEvent_data_maps_value_DataMapObjects_objects[][];
}

export type UpdateEventGetData_getEvent_data_maps_value = UpdateEventGetData_getEvent_data_maps_value_DataMapValueContainer | UpdateEventGetData_getEvent_data_maps_value_DataMapValueContainerArray | UpdateEventGetData_getEvent_data_maps_value_DataMapObject | UpdateEventGetData_getEvent_data_maps_value_DataMapObjects;

export interface UpdateEventGetData_getEvent_data_maps {
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
  value: UpdateEventGetData_getEvent_data_maps_value | null;
}

export interface UpdateEventGetData_getEvent {
  __typename: "Event";
  /**
   * The `Event` name
   */
  name: string;
  /**
   * Either a `CustomEvent` or `PlatformEvent`
   */
  event: UpdateEventGetData_getEvent_event;
  /**
   * The period after which the event state should be cleared. -1 = Inactive, 0 =
   * Immidately, > 0, after some time specified in milliseconds. This useful for
   * events that need to be re-triggered within some period of time to pass the check stage.
   */
  clear_state_ms: number;
  /**
   * `DataMap`'s that implements the `PlatformDataMap` of the connected `PlatformEvent`
   */
  data_maps: UpdateEventGetData_getEvent_data_maps[];
}

export interface UpdateEventGetData {
  /**
   * @bound=Trigger
   * Get a `Trigger` model from the `Trigger` ID
   */
  getTrigger: UpdateEventGetData_getTrigger;
  /**
   * @bound=Event
   * Get a `Event` model from the `Event` ID
   */
  getEvent: UpdateEventGetData_getEvent;
}

export interface UpdateEventGetDataVariables {
  id: string;
  triggerId: string;
}
