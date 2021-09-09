/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteRule
// ====================================================

export interface DeleteRule_deleteRule {
  __typename: "ModelDeleteAcknowledgement";
  /**
   * The ID of the model that has been deleted
   */
  id: string;
  /**
   * Name of the model that the entity belonged to
   */
  model: string;
  /**
   * The name of the model that has been deleted
   */
  name: string;
}

export interface DeleteRule {
  /**
   * @bound=Rule
   * Delete a `Rule` and its children.
   */
  deleteRule: DeleteRule_deleteRule[];
}

export interface DeleteRuleVariables {
  ruleDeleteInput: RuleDeleteInput;
}
