/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VarType, InputType, TypeIcon, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: InspectEventData
// ====================================================

export interface InspectEventData_getEvent_event_CustomEvent {
  __typename: "CustomEvent";
  /**
   * The name of the event to listen for.
   */
  custom_name: string;
}

export interface InspectEventData_getEvent_event_PlatformEvent_platform {
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

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_validation_rules {
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

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_default_value = InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainer | InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_default_value_DefaultValueContainerArray;

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value = InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps {
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
  validation_rules: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface InspectEventData_getEvent_event_PlatformEvent_platform_data_maps {
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
  validation_rules: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps_child_platform_data_maps[];
}

export interface InspectEventData_getEvent_event_PlatformEvent {
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
  platform: InspectEventData_getEvent_event_PlatformEvent_platform;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This
   * can be directly accessed by the event when called.
   */
  platform_data_maps: InspectEventData_getEvent_event_PlatformEvent_platform_data_maps[];
}

export type InspectEventData_getEvent_event = InspectEventData_getEvent_event_CustomEvent | InspectEventData_getEvent_event_PlatformEvent;

export interface InspectEventData_getEvent_data_maps_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value = InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapObject | InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainer | InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object {
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
  value: InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object_value | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject_object[];
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value = InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapObject | InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainer | InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects {
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
  value: InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects_value | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects_objects[][];
}

export type InspectEventData_getEvent_data_maps_value_DataMapObject_object_value = InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainer | InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapValueContainerArray | InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObject | InspectEventData_getEvent_data_maps_value_DataMapObject_object_value_DataMapObjects;

export interface InspectEventData_getEvent_data_maps_value_DataMapObject_object {
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
  value: InspectEventData_getEvent_data_maps_value_DataMapObject_object_value | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: InspectEventData_getEvent_data_maps_value_DataMapObject_object[];
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value = InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapObject | InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainer | InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value_DataMapValueContainerArray;

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object {
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
  value: InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object_value | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject";
  /**
   * Contains a list of `DataMap`
   */
  object: InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject_object[];
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject {
  __typename: "DataMapObject" | "DataMapObjects";
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer {
  __typename: "DataMapValueContainer";
  /**
   * Contains a `DataMapValue`
   */
  value: S8DataMapValue | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray {
  __typename: "DataMapValueContainerArray";
  /**
   * Contains a list of `DataMapValue`
   */
  values: S8DataMapValue[] | null;
}

export type InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value = InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapObject | InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainer | InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value_DataMapValueContainerArray;

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects {
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
  value: InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects_value | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects_objects[][];
}

export type InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value = InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainer | InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapValueContainerArray | InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObject | InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value_DataMapObjects;

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects_objects {
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
  value: InspectEventData_getEvent_data_maps_value_DataMapObjects_objects_value | null;
}

export interface InspectEventData_getEvent_data_maps_value_DataMapObjects {
  __typename: "DataMapObjects";
  /**
   * Contains a list of lists of `DataMap`. This implements repeated object patterns.
   */
  objects: InspectEventData_getEvent_data_maps_value_DataMapObjects_objects[][];
}

export type InspectEventData_getEvent_data_maps_value = InspectEventData_getEvent_data_maps_value_DataMapValueContainer | InspectEventData_getEvent_data_maps_value_DataMapValueContainerArray | InspectEventData_getEvent_data_maps_value_DataMapObject | InspectEventData_getEvent_data_maps_value_DataMapObjects;

export interface InspectEventData_getEvent_data_maps {
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
  value: InspectEventData_getEvent_data_maps_value | null;
}

export interface InspectEventData_getEvent {
  __typename: "Event";
  /**
   * The `Event` name
   */
  name: string;
  /**
   * The period after which the event state should be cleared. -1 = Inactive, 0 =
   * Immidately, > 0, after some time specified in milliseconds. This useful for
   * events that need to be re-triggered within some period of time to pass the check stage.
   */
  clear_state_ms: number;
  /**
   * Either a `CustomEvent` or `PlatformEvent`
   */
  event: InspectEventData_getEvent_event;
  /**
   * `DataMap`'s that implements the `PlatformDataMap` of the connected `PlatformEvent`
   */
  data_maps: InspectEventData_getEvent_data_maps[];
}

export interface InspectEventData {
  /**
   * @bound=Event
   * Get a `Event` model from the `Event` ID
   */
  getEvent: InspectEventData_getEvent;
}

export interface InspectEventDataVariables {
  id: string;
}
