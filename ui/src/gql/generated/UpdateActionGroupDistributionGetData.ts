/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateActionGroupDistributionGetData
// ====================================================

export interface UpdateActionGroupDistributionGetData_getActionGroupDistribution {
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

export interface UpdateActionGroupDistributionGetData {
  /**
   * @bound=ActionGroupDistribution
   * Get a `ActionGroupDistribution` model from the `ActionGroupDistribution` ID
   */
  getActionGroupDistribution: UpdateActionGroupDistributionGetData_getActionGroupDistribution;
}

export interface UpdateActionGroupDistributionGetDataVariables {
  id: string;
}
