/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateActionGroup
// ====================================================

export interface CreateActionGroup_createActionGroup {
  __typename: "ActionGroup";
  /**
   * `ActionGroup` ID
   */
  id: string;
}

export interface CreateActionGroup {
  /**
   * @bound=ActionGroup
   * Create a new `ActionGroup`. `ActionGroupDistribution` ID is required here to ensure `ActionGroup` is placed inside the correct `ActionGroupDistribution`
   */
  createActionGroup: CreateActionGroup_createActionGroup;
}

export interface CreateActionGroupVariables {
  actionGroupCreateInput: ActionGroupCreateInput;
}
