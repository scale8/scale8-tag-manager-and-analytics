/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IngestEndpointRevisionsData
// ====================================================

export interface IngestEndpointRevisionsData_getIngestEndpoint_ingest_endpoint_revisions {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * Name of the `IngestEndpointRevision`
   */
  name: string;
  /**
   * The `IngestEndpointRevision` has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Date the `IngestEndpointRevision` was created
   */
  created_at: S8DateTime;
  /**
   * Date the `IngestEndpointRevision` was last updated
   */
  updated_at: S8DateTime;
}

export interface IngestEndpointRevisionsData_getIngestEndpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * The `IngestEndpointRevision`s connected to the `IngestEndpoint`
   */
  ingest_endpoint_revisions: IngestEndpointRevisionsData_getIngestEndpoint_ingest_endpoint_revisions[];
}

export interface IngestEndpointRevisionsData {
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: IngestEndpointRevisionsData_getIngestEndpoint;
}

export interface IngestEndpointRevisionsDataVariables {
  id: string;
}
