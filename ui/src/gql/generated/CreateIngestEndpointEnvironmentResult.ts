/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestEndpointEnvironmentCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateIngestEndpointEnvironmentResult
// ====================================================

export interface CreateIngestEndpointEnvironmentResult_createIngestEndpointEnvironment {
  __typename: "IngestEndpointEnvironment";
  /**
   * ID of the `IngestEndpointEnvironment`
   */
  id: string;
}

export interface CreateIngestEndpointEnvironmentResult {
  /**
   * @bound=IngestEndpointEnvironment
   * Create a new `IngestEndpointEnvironment`.
   */
  createIngestEndpointEnvironment: CreateIngestEndpointEnvironmentResult_createIngestEndpointEnvironment;
}

export interface CreateIngestEndpointEnvironmentResultVariables {
  ingestEndpointEnvironmentCreateInput: IngestEndpointEnvironmentCreateInput;
}
