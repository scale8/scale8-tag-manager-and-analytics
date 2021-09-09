/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRuleResult
// ====================================================

export interface CreateRuleResult_createRule {
  __typename: "Rule";
  /**
   * The ID of the `Rule`
   */
  id: string;
}

export interface CreateRuleResult {
  /**
   * @bound=Rule
   * Create a new `Rule`. `RuleGroup` ID is required here to ensure `Rule` is placed inside the correct version
   */
  createRule: CreateRuleResult_createRule;
}

export interface CreateRuleResultVariables {
  ruleCreateInput: RuleCreateInput;
}
