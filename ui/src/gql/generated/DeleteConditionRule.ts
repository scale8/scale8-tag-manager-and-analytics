/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConditionRuleDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteConditionRule
// ====================================================

export interface DeleteConditionRule_deleteConditionRule {
  __typename: "ModelDeleteAcknowledgement";
  /**
   * The ID of the model that has been deleted
   */
  id: string;
}

export interface DeleteConditionRule {
  /**
   * @bound=ConditionRule
   * Delete a `ConditionRule` and its children.
   */
  deleteConditionRule: DeleteConditionRule_deleteConditionRule[];
}

export interface DeleteConditionRuleVariables {
  conditionRuleDeleteInput: ConditionRuleDeleteInput;
}
