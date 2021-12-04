/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ValidationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UpdateIngestEndpointDataMapGetData
// ====================================================

export interface UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_default_value = UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_default_value_DefaultValueContainer | UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_default_value_DefaultValueContainerArray;

export interface UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_validation_rules {
  __typename: "IngestEndpointDataMapValidation";
  /**
   * Validation type
   */
  type: ValidationType;
  /**
   * Input value to check against
   */
  input_value: S8DataMapValue | null;
}

export interface UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap {
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
   * The default value. If no input is provided for this property, then the default value will be applied automatically
   */
  default_value: UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_default_value | null;
  /**
   * Whether or not the property is optional or not
   */
  is_optional: boolean;
  /**
   * A list of validation rules associated with this `IngestEndpointDataMap`.
   */
  validation_rules: UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap_validation_rules[] | null;
}

export interface UpdateIngestEndpointDataMapGetData {
  /**
   * @bound=IngestEndpointDataMap
   */
  getIngestEndpointDataMap: UpdateIngestEndpointDataMapGetData_getIngestEndpointDataMap;
}

export interface UpdateIngestEndpointDataMapGetDataVariables {
  id: string;
}
