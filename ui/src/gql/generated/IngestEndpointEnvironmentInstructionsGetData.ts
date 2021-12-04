/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IngestEndpointEnvironmentInstructionsGetData
// ====================================================

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value = IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainer | IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value = IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer | IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value = IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer | IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps {
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
  default_value: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value | null;
}

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps {
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
  default_value: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value | null;
  /**
   * If the variable type (see `VarType`) has been specified as an object or array
   * of objects, then this contains the child property definitions
   */
  child_ingest_endpoint_data_maps: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps[];
}

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps {
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
  default_value: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_default_value | null;
  /**
   * If the variable type (see `VarType`) has been specified as an object or array
   * of objects, then this contains the child property definitions
   */
  child_ingest_endpoint_data_maps: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps[];
}

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * The `IngestEndpointDataMaps`s that construct the payload (key => value) configuration for the `IngestEndpointRevision`
   */
  ingest_endpoint_data_maps: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision_ingest_endpoint_data_maps[];
}

export interface IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment {
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
   * `IngestEndpointEnvironment`'s install domain used to push data to
   */
  install_domain: string;
  /**
   * A custom domain name associated with this `IngestEndpointEnvironment`
   */
  custom_domain: string | null;
  /**
   * The `IngestEndpointRevision` currently bound to the `IngestEndpointEnvironment`
   */
  ingest_endpoint_revision: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment_ingest_endpoint_revision;
}

export interface IngestEndpointEnvironmentInstructionsGetData {
  /**
   * @bound=IngestEndpointEnvironment
   * Get an `IngestEndpointEnvironment` model from `IngestEndpointEnvironment` ID
   */
  getIngestEndpointEnvironment: IngestEndpointEnvironmentInstructionsGetData_getIngestEndpointEnvironment;
}

export interface IngestEndpointEnvironmentInstructionsGetDataVariables {
  id: string;
}
