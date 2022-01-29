/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ActionDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteAction
// ====================================================

export interface DeleteAction_deleteAction {
  __typename: "ModelDeleteAcknowledgement";
  /**
   * The ID of the model that has been deleted
   */
  id: string;
}

export interface DeleteAction {
  /**
   * @bound=Action
   * Delete an `Action` and its children.
   */
  deleteAction: DeleteAction_deleteAction[];
}

export interface DeleteActionVariables {
  actionDeleteInput: ActionDeleteInput;
}
