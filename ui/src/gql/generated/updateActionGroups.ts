/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateActionGroups
// ====================================================

export interface updateActionGroups {
  /**
   * @bound=ActionGroup
   * Update a set of `ActionGroup`'s details.
   */
  updateActionGroups: boolean;
}

export interface updateActionGroupsVariables {
  actionGroupUpdateInputs: ActionGroupUpdateInput[];
}
