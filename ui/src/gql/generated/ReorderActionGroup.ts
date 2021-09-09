/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupDistributionOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReorderActionGroup
// ====================================================

export interface ReorderActionGroup {
  /**
   * @bound=ActionGroupDistribution
   * Update the order of `ActionGroup`'s curently linked to `ActionGroupDistribution`
   */
  updateActionGroupsOrder: boolean;
}

export interface ReorderActionGroupVariables {
  actionGroupDistributionOrderInput: ActionGroupDistributionOrderInput;
}
