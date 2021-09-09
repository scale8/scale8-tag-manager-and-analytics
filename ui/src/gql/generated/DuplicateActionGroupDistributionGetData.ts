/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateActionGroupDistributionGetData
// ====================================================

export interface DuplicateActionGroupDistributionGetData_getActionGroupDistribution {
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

export interface DuplicateActionGroupDistributionGetData {
  /**
   * @bound=ActionGroupDistribution
   * Get a `ActionGroupDistribution` model from the `ActionGroupDistribution` ID
   */
  getActionGroupDistribution: DuplicateActionGroupDistributionGetData_getActionGroupDistribution;
}

export interface DuplicateActionGroupDistributionGetDataVariables {
  id: string;
}
