/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupDistributionDuplicateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateActionGroupDistribution
// ====================================================

export interface DuplicateActionGroupDistribution_duplicateActionGroupDistribution {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
}

export interface DuplicateActionGroupDistribution {
  /**
   * @bound=ActionGroupDistribution
   * Duplicate an existing `ActionGroupDistribution`. The duplicated will copy everything beneath `ActionGroupDistribution`, creating a new `ActionGroupDistribution` entity and linking it to the same `Rule`
   */
  duplicateActionGroupDistribution: DuplicateActionGroupDistribution_duplicateActionGroupDistribution;
}

export interface DuplicateActionGroupDistributionVariables {
  actionGroupDistributionDuplicateInput: ActionGroupDistributionDuplicateInput;
}
