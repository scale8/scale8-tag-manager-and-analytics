/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IngestEndpointRevisionUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateIngestEndpointRevisionResult
// ====================================================

export interface UpdateIngestEndpointRevisionResult {
  /**
   * @bound=IngestEndpointRevision
   * Update a `IngestEndpointRevision`'s details.
   */
  updateIngestEndpointRevision: boolean;
}

export interface UpdateIngestEndpointRevisionResultVariables {
  ingestEndpointRevisionUpdateInput: IngestEndpointRevisionUpdateInput;
}
