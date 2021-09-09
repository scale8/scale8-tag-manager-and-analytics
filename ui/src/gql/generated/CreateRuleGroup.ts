/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleGroupCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRuleGroup
// ====================================================

export interface CreateRuleGroup_createRuleGroup {
  __typename: "RuleGroup";
  /**
   * The `RuleGroup` ID
   */
  id: string;
}

export interface CreateRuleGroup {
  /**
   * @bound=RuleGroup
   * Create a new `RuleGroup`. `Tag` ID is required here to ensure `RuleGroup` is placed inside the correct version
   */
  createRuleGroup: CreateRuleGroup_createRuleGroup;
}

export interface CreateRuleGroupVariables {
  ruleGroupCreateInput: RuleGroupCreateInput;
}
