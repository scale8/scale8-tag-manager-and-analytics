/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchAvailableGlobalActions
// ====================================================

export interface FetchAvailableGlobalActions_getTag_revision_global_action_group_distributions {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
  /**
   * `ActionGroupDistribution` name
   */
  name: string;
}

export interface FetchAvailableGlobalActions_getTag_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Get all the global triggers linked to this revision
   */
  global_action_group_distributions: FetchAvailableGlobalActions_getTag_revision_global_action_group_distributions[];
}

export interface FetchAvailableGlobalActions_getTag {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
  /**
   * Revision
   */
  revision: FetchAvailableGlobalActions_getTag_revision;
}

export interface FetchAvailableGlobalActions_getRule_action_groups_distributions {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
}

export interface FetchAvailableGlobalActions_getRule {
  __typename: "Rule";
  /**
   * The ID of the `Rule`
   */
  id: string;
  /**
   * All set of `ActionGroupDistribution`'s attached to this `Rule` and will be triggered once `Event` and `ConditionRule`'s are considered
   */
  action_groups_distributions: FetchAvailableGlobalActions_getRule_action_groups_distributions[];
}

export interface FetchAvailableGlobalActions {
  /**
   * @bound=Tag
   * Get an Tag model from the Tag ID
   */
  getTag: FetchAvailableGlobalActions_getTag;
  /**
   * @bound=Rule
   * Get a `Rule` model from the `Rule` ID
   */
  getRule: FetchAvailableGlobalActions_getRule;
}

export interface FetchAvailableGlobalActionsVariables {
  tagId: string;
  ruleId: string;
}
