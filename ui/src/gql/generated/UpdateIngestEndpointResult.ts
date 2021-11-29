/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestEndpointUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateIngestEndpointResult
// ====================================================

export interface UpdateIngestEndpointResult {
  /**
   * @bound=IngestEndpoint
   * Update a `IngestEndpoint`'s details.
   */
  updateIngestEndpoint: boolean;
}

export interface UpdateIngestEndpointResultVariables {
  ingestEndpointUpdateInput: IngestEndpointUpdateInput;
}
