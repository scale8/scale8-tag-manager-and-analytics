/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DuplicateRevisionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateAppRevision
// ====================================================

export interface DuplicateAppRevision_duplicateRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
}

export interface DuplicateAppRevision {
  /**
   * @bound=Revision
   * Duplicate revision will clone any linked items and return a new revision
   */
  duplicateRevision: DuplicateAppRevision_duplicateRevision;
}

export interface DuplicateAppRevisionVariables {
  duplicateRevisionInput: DuplicateRevisionInput;
}
