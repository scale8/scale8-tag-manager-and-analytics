/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateIngestEndpointRevisionGetData
// ====================================================

export interface UpdateIngestEndpointRevisionGetData_getIngestEndpointRevision {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * Name of the `IngestEndpointRevision`
   */
  name: string;
}

export interface UpdateIngestEndpointRevisionGetData {
  /**
   * @bound=IngestEndpointRevision
   * Get a `IngestEndpointRevision` by it's ID
   */
  getIngestEndpointRevision: UpdateIngestEndpointRevisionGetData_getIngestEndpointRevision;
}

export interface UpdateIngestEndpointRevisionGetDataVariables {
  id: string;
}
