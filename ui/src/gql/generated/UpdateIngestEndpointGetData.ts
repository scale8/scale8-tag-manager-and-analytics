/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateIngestEndpointGetData
// ====================================================

export interface UpdateIngestEndpointGetData_getIngestEndpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * Name of the `IngestEndpoint`
   */
  name: string;
}

export interface UpdateIngestEndpointGetData {
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: UpdateIngestEndpointGetData_getIngestEndpoint;
}

export interface UpdateIngestEndpointGetDataVariables {
  id: string;
}
