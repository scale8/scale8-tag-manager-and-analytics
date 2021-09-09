/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateRuleGetData
// ====================================================

export interface UpdateRuleGetData_getRule {
  __typename: "Rule";
  /**
   * The ID of the `Rule`
   */
  id: string;
  /**
   * The name of the `Rule`
   */
  name: string;
  /**
   * The minimum refresh interval. -1 = the rule can't repeat. 0 = the rule can repeat. > 0 the rule must wait this many milliseconds before being allowed to repeat again.
   */
  min_repeat_interval: number;
}

export interface UpdateRuleGetData {
  /**
   * @bound=Rule
   * Get a `Rule` model from the `Rule` ID
   */
  getRule: UpdateRuleGetData_getRule;
}

export interface UpdateRuleGetDataVariables {
  id: string;
}
