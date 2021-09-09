/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleGroupDuplicateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateRuleGroup
// ====================================================

export interface DuplicateRuleGroup_duplicateRuleGroup {
  __typename: "RuleGroup";
  /**
   * The `RuleGroup` ID
   */
  id: string;
}

export interface DuplicateRuleGroup {
  /**
   * @bound=RuleGroup
   * Duplicate a new `RuleGroup`. The duplicated will copy everything beneath `RuleGroup`, creating a new `RuleGroup` entity and linking it to the same `Tag`
   */
  duplicateRuleGroup: DuplicateRuleGroup_duplicateRuleGroup;
}

export interface DuplicateRuleGroupVariables {
  ruleGroupDuplicateInput: RuleGroupDuplicateInput;
}
