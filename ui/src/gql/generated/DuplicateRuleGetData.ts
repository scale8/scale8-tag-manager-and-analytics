/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateRuleGetData
// ====================================================

export interface DuplicateRuleGetData_getRule {
  __typename: "Rule";
  /**
   * The ID of the `Rule`
   */
  id: string;
  /**
   * The name of the `Rule`
   */
  name: string;
}

export interface DuplicateRuleGetData {
  /**
   * @bound=Rule
   * Get a `Rule` model from the `Rule` ID
   */
  getRule: DuplicateRuleGetData_getRule;
}

export interface DuplicateRuleGetDataVariables {
  id: string;
}
