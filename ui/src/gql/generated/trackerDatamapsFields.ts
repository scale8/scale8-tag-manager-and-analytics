/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: trackerDatamapsFields
// ====================================================

export interface trackerDatamapsFields_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface trackerDatamapsFields_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type trackerDatamapsFields_default_value = trackerDatamapsFields_default_value_DefaultValueContainer | trackerDatamapsFields_default_value_DefaultValueContainerArray;

export interface trackerDatamapsFields {
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
  default_value: trackerDatamapsFields_default_value | null;
}
