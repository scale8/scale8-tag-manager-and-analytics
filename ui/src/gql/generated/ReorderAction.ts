/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ActionGroupOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReorderAction
// ====================================================

export interface ReorderAction {
  /**
   * @bound=ActionGroup
   * Update the order of `Action`'s curently linked to `ActionGroup`
   */
  updateActionsOrder: boolean;
}

export interface ReorderActionVariables {
  actionGroupOrderInput: ActionGroupOrderInput;
}
