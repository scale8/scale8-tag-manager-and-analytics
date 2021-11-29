/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateIngestEndpointRevisionGetData
// ====================================================

export interface DuplicateIngestEndpointRevisionGetData_getIngestEndpointRevision {
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

export interface DuplicateIngestEndpointRevisionGetData {
  /**
   * @bound=IngestEndpointRevision
   * Get a `IngestEndpointRevision` by it's ID
   */
  getIngestEndpointRevision: DuplicateIngestEndpointRevisionGetData_getIngestEndpointRevision;
}

export interface DuplicateIngestEndpointRevisionGetDataVariables {
  id: string;
}
