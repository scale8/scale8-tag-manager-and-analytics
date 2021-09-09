/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagDuplicateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateTag
// ====================================================

export interface DuplicateTag_duplicateTag {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
}

export interface DuplicateTag {
  /**
   * @bound=Tag
   * Duplicate a new `Tag`. The duplicated will copy everything beneath `Tag`, creating a new `Tag` entity and linking it to the same Revision
   */
  duplicateTag: DuplicateTag_duplicateTag;
}

export interface DuplicateTagVariables {
  tagDuplicateInput: TagDuplicateInput;
}
