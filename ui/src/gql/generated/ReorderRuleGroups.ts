/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagRuleGroupOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReorderRuleGroups
// ====================================================

export interface ReorderRuleGroups {
  /**
   * @bound=Tag
   * Update the order of `RuleGroup`'s curently linked to `Tag`
   */
  updateRuleGroupsOrder: boolean;
}

export interface ReorderRuleGroupsVariables {
  tagRuleGroupOrderInput: TagRuleGroupOrderInput;
}
