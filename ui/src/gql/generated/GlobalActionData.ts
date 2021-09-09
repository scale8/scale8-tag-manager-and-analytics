/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupDistributionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GlobalActionData
// ====================================================

export interface GlobalActionData_getRevision_global_action_group_distributions_action_groups {
  __typename: "ActionGroup";
  /**
   * `ActionGroup` ID
   */
  id: string;
}

export interface GlobalActionData_getRevision_global_action_group_distributions {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
  /**
   * `ActionGroupDistribution` name
   */
  name: string;
  /**
   * `ActionGroupDistribution` distribution type (see `ActionGroupDistributionType`)
   */
  action_group_distribution_type: ActionGroupDistributionType;
  /**
   * `ActionGroup`'s associated with this `ActionGroupDistribution`
   */
  action_groups: GlobalActionData_getRevision_global_action_group_distributions_action_groups[];
  /**
   * Date the action group distribution was created
   */
  created_at: S8DateTime;
  /**
   * Date the action group distribution was last updated
   */
  updated_at: S8DateTime;
}

export interface GlobalActionData_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Get all the global triggers linked to this revision
   */
  global_action_group_distributions: GlobalActionData_getRevision_global_action_group_distributions[];
}

export interface GlobalActionData {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: GlobalActionData_getRevision;
}

export interface GlobalActionDataVariables {
  id: string;
}
