/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ActionGroupDistributionCreateInput, ActionGroupDistributionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateActionGroupDistribution
// ====================================================

export interface CreateActionGroupDistribution_createActionGroupDistribution {
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
}

export interface CreateActionGroupDistribution {
  /**
   * @bound=ActionGroupDistribution
   * Create a new `ActionGroupDistribution`. `Rule` ID is required here to ensure
   * `ActionGroupDistribution` is placed inside the correct version
   */
  createActionGroupDistribution: CreateActionGroupDistribution_createActionGroupDistribution;
}

export interface CreateActionGroupDistributionVariables {
  actionGroupDistributionCreateInput: ActionGroupDistributionCreateInput;
}
