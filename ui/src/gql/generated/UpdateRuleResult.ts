/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateRuleResult
// ====================================================

export interface UpdateRuleResult {
  /**
   * @bound=Rule
   * Update a `Rule`'s details.
   */
  updateRule: boolean;
}

export interface UpdateRuleResultVariables {
  ruleUpdateInput: RuleUpdateInput;
}
