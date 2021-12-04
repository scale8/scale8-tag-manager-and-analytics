/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestEndpointCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateIngestEndpointResult
// ====================================================

export interface CreateIngestEndpointResult_createIngestEndpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
}

export interface CreateIngestEndpointResult {
  /**
   * @bound=IngestEndpoint
   * Create a new `IngestEndpoint`.
   */
  createIngestEndpoint: CreateIngestEndpointResult_createIngestEndpoint;
}

export interface CreateIngestEndpointResultVariables {
  ingestEndpointCreateInput: IngestEndpointCreateInput;
}
