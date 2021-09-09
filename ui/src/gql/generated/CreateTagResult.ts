/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTagResult
// ====================================================

export interface CreateTagResult_createTag {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
}

export interface CreateTagResult {
  /**
   * @bound=Tag
   * Create a new `Tag`. `Revision` ID is required here to ensure `Tag` is placed inside the correct version
   */
  createTag: CreateTagResult_createTag;
}

export interface CreateTagResultVariables {
  tagCreateInput: TagCreateInput;
}
