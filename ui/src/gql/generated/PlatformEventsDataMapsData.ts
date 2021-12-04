/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VarType, InputType, TypeIcon, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: PlatformEventsDataMapsData
// ====================================================

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_validation_rules {
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

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_default_value = PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_default_value_DefaultValueContainer | PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_default_value_DefaultValueContainerArray;

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_default_value = PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps {
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
  validation_rules: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps {
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
  validation_rules: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps_child_platform_data_maps[];
}

export interface PlatformEventsDataMapsData_getPlatformEvent {
  __typename: "PlatformEvent";
  /**
   * ID of the `PlatformEvent`
   */
  id: string;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This
   * can be directly accessed by the event when called.
   */
  platform_data_maps: PlatformEventsDataMapsData_getPlatformEvent_platform_data_maps[];
}

export interface PlatformEventsDataMapsData {
  /**
   * @bound=PlatformEvent
   * Method will return a `PlatformEvent` instance from its ID.
   */
  getPlatformEvent: PlatformEventsDataMapsData_getPlatformEvent;
}

export interface PlatformEventsDataMapsDataVariables {
  id: string;
}
