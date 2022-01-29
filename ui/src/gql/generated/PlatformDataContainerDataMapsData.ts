/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VarType, InputType, TypeIcon, ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: PlatformDataContainerDataMapsData
// ====================================================

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_validation_rules {
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

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_default_value = PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_default_value_DefaultValueContainer | PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_default_value_DefaultValueContainerArray;

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_default_value = PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules {
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

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value = PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainer | PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value_DefaultValueContainerArray;

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps {
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
  validation_rules: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps_default_value | null;
}

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps {
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
  validation_rules: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps_child_platform_data_maps[];
}

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps {
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
  validation_rules: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_validation_rules[] | null;
  /**
   * If this value is optional or not. If the value is optional then this `PlatformDataMap` must be implemented correctly.
   */
  is_optional: boolean;
  /**
   * Default value - used when `PlatformDataMap` has been created as optional and `PlatformDataMap` has not been implemented
   */
  default_value: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_default_value | null;
  /**
   * Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These
   * contain nested `PlatformDataMap` in a document or array document structure respectivly
   */
  child_platform_data_maps: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps_child_platform_data_maps[];
}

export interface PlatformDataContainerDataMapsData_getPlatformDataContainer {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * A list of `PlatformDataMap` that describe the document style structure of this data layer
   */
  platform_data_maps: PlatformDataContainerDataMapsData_getPlatformDataContainer_platform_data_maps[];
}

export interface PlatformDataContainerDataMapsData {
  /**
   * @bound=PlatformDataContainer
   * Method will return a `PlatformDataContainer` instance from its ID.
   */
  getPlatformDataContainer: PlatformDataContainerDataMapsData_getPlatformDataContainer;
}

export interface PlatformDataContainerDataMapsDataVariables {
  id: string;
}
