/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RuleGroupDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteRuleGroup
// ====================================================

export interface DeleteRuleGroup_deleteRuleGroup {
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

export interface DeleteRuleGroup {
  /**
   * @bound=RuleGroup
   * Delete a `RuleGroup` and its children.
   */
  deleteRuleGroup: DeleteRuleGroup_deleteRuleGroup[];
}

export interface DeleteRuleGroupVariables {
  ruleGroupDeleteInput: RuleGroupDeleteInput;
}
