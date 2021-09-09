/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleGroupRuleOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReorderRules
// ====================================================

export interface ReorderRules {
  /**
   * @bound=RuleGroup
   * Update the order of `Rule`'s curently linked to `RuleGroup`
   */
  updateRulesOrder: boolean;
}

export interface ReorderRulesVariables {
  ruleGroupRuleOrderInput: RuleGroupRuleOrderInput;
}
