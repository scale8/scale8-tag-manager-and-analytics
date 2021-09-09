/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TriggerDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteGlobalTrigger
// ====================================================

export interface DeleteGlobalTrigger_deleteTrigger {
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

export interface DeleteGlobalTrigger {
  /**
   * @bound=Trigger
   * Delete a `Trigger` and its children.
   */
  deleteTrigger: DeleteGlobalTrigger_deleteTrigger[];
}

export interface DeleteGlobalTriggerVariables {
  triggerDeleteInput: TriggerDeleteInput;
}
