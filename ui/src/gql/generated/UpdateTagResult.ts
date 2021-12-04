/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TagUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTagResult
// ====================================================

export interface UpdateTagResult {
  /**
   * @bound=Tag
   * Update a `Tag`'s details.
   */
  updateTag: boolean;
}

export interface UpdateTagResultVariables {
  tagUpdateInput: TagUpdateInput;
}
