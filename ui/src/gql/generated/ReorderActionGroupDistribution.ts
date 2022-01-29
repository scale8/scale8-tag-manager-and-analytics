/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RuleOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReorderActionGroupDistribution
// ====================================================

export interface ReorderActionGroupDistribution {
  /**
   * @bound=Rule
   * Update the order of `ActionDistribution`'s curently linked to `Rule`
   */
  updateActionDistributionsOrder: boolean;
}

export interface ReorderActionGroupDistributionVariables {
  ruleOrderInput: RuleOrderInput;
}
