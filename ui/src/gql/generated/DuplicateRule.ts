/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleDuplicateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateRule
// ====================================================

export interface DuplicateRule_duplicateRule {
  __typename: "Rule";
  /**
   * The ID of the `Rule`
   */
  id: string;
}

export interface DuplicateRule {
  /**
   * @bound=Rule
   * Duplicate a new `Rule`. The duplicated will copy everything beneath `Rule`, creating a new `Rule` entity and linking it to the same `RuleGroup`
   */
  duplicateRule: DuplicateRule_duplicateRule;
}

export interface DuplicateRuleVariables {
  ruleDuplicateInput: RuleDuplicateInput;
}
