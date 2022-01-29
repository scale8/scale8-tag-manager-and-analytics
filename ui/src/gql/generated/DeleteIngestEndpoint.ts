/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestEndpointDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteIngestEndpoint
// ====================================================

export interface DeleteIngestEndpoint {
  /**
   * @bound=IngestEndpoint
   * Delete a `IngestEndpoint` and its children.
   */
  deleteIngestEndpoint: boolean;
}

export interface DeleteIngestEndpointVariables {
  ingestEndpointDeleteInput: IngestEndpointDeleteInput;
}
