/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FinaliseIngestEndpointRevisionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: FinaliseIngestEndpointRevision
// ====================================================

export interface FinaliseIngestEndpointRevision {
  /**
   * @bound=IngestEndpointRevision
   * To link a `IngestEndpointRevision` to a `IngestEndpointEnvironment` it must be 'locked', i.e in its final state
   */
  finaliseIngestEndpointRevision: boolean;
}

export interface FinaliseIngestEndpointRevisionVariables {
  finaliseIngestEndpointRevisionInput: FinaliseIngestEndpointRevisionInput;
}
