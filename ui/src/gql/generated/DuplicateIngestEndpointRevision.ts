/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DuplicateIngestEndpointRevisionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateIngestEndpointRevision
// ====================================================

export interface DuplicateIngestEndpointRevision_duplicateIngestEndpointRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
}

export interface DuplicateIngestEndpointRevision {
  /**
   * @bound=IngestEndpointRevision
   * Duplicating a `IngestEndpointRevision` will clone any linked items and return a new `IngestEndpointRevision`
   */
  duplicateIngestEndpointRevision: DuplicateIngestEndpointRevision_duplicateIngestEndpointRevision;
}

export interface DuplicateIngestEndpointRevisionVariables {
  duplicateIngestEndpointRevisionInput: DuplicateIngestEndpointRevisionInput;
}
