/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateRuleGroupGetData
// ====================================================

export interface DuplicateRuleGroupGetData_getRuleGroup {
  __typename: "RuleGroup";
  /**
   * The `RuleGroup` ID
   */
  id: string;
  /**
   * Name associated with the `RuleGroup`
   */
  name: string;
}

export interface DuplicateRuleGroupGetData {
  /**
   * @bound=RuleGroup
   * Get a `RuleGroup` model from the `RuleGroup` ID
   */
  getRuleGroup: DuplicateRuleGroupGetData_getRuleGroup;
}

export interface DuplicateRuleGroupGetDataVariables {
  id: string;
}
