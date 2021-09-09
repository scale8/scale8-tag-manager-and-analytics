/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupDistributionDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteActionGroupDistribution
// ====================================================

export interface DeleteActionGroupDistribution_deleteActionGroupDistribution {
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

export interface DeleteActionGroupDistribution {
  /**
   * @bound=ActionGroupDistribution
   * Delete a `ActionGroupDistribution` and its children.
   */
  deleteActionGroupDistribution: DeleteActionGroupDistribution_deleteActionGroupDistribution[];
}

export interface DeleteActionGroupDistributionVariables {
  actionGroupDistributionDeleteInput: ActionGroupDistributionDeleteInput;
}
