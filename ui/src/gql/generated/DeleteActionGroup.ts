/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ActionGroupDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteActionGroup
// ====================================================

export interface DeleteActionGroup_deleteActionGroup {
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

export interface DeleteActionGroup {
  /**
   * @bound=ActionGroup
   * Delete a `ActionGroup` and its children.
   */
  deleteActionGroup: DeleteActionGroup_deleteActionGroup[];
}

export interface DeleteActionGroupVariables {
  actionGroupDeleteInput: ActionGroupDeleteInput;
}
