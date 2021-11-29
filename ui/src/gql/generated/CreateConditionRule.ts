/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ConditionRuleCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateConditionRule
// ====================================================

export interface CreateConditionRule_createConditionRule {
  __typename: "Rule";
  /**
   * The ID of the `Rule`
   */
  id: string;
}

export interface CreateConditionRule {
  /**
   * @bound=ConditionRule
   * Create a new `ConditionRule`. `Trigger` ID is required here to ensure
   * `ConditionRule` is placed inside the correct `Trigger`
   */
  createConditionRule: CreateConditionRule_createConditionRule;
}

export interface CreateConditionRuleVariables {
  conditionRuleCreateInput: ConditionRuleCreateInput;
}
