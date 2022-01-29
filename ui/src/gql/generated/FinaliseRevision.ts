/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FinaliseRevisionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: FinaliseRevision
// ====================================================

export interface FinaliseRevision_finaliseRevision {
  __typename: "RevisionIssue";
  /**
   * The ID of the model producing the issue
   */
  modelId: string;
  /**
   * Name of the model that is producting an issue
   */
  model: string;
  /**
   * A simple explaination of the issue itself
   */
  issue: string;
  /**
   * If available, the field associated with the model causing an issue
   */
  gqlField: string | null;
}

export interface FinaliseRevision {
  /**
   * @bound=Revision
   * To link a revision to an environment it must be 'locked', i.e in its final state
   */
  finaliseRevision: FinaliseRevision_finaliseRevision[];
}

export interface FinaliseRevisionVariables {
  finaliseRevisionInput: FinaliseRevisionInput;
}
