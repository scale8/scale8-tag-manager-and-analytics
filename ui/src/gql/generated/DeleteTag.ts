/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteTag
// ====================================================

export interface DeleteTag_deleteTag {
  __typename: "ModelDeleteAcknowledgement";
  /**
   * The ID of the model that has been deleted
   */
  id: string;
  /**
   * Name of the model that the entity belonged to
   */
  model: string;
  /**
   * The name of the model that has been deleted
   */
  name: string;
}

export interface DeleteTag {
  /**
   * @bound=Tag
   * Delete a `Tag` and its children.
   */
  deleteTag: DeleteTag_deleteTag[];
}

export interface DeleteTagVariables {
  tagDeleteInput: TagDeleteInput;
}
