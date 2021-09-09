/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateRuleGroupGetData
// ====================================================

export interface UpdateRuleGroupGetData_getRuleGroup {
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

export interface UpdateRuleGroupGetData {
  /**
   * @bound=RuleGroup
   * Get a `RuleGroup` model from the `RuleGroup` ID
   */
  getRuleGroup: UpdateRuleGroupGetData_getRuleGroup;
}

export interface UpdateRuleGroupGetDataVariables {
  id: string;
}
