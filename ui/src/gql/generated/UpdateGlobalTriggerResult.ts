/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TriggerUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateGlobalTriggerResult
// ====================================================

export interface UpdateGlobalTriggerResult {
  /**
   * @bound=Trigger
   * Update a `Trigger`'s details.
   */
  updateTrigger: boolean;
}

export interface UpdateGlobalTriggerResultVariables {
  triggerUpdateInput: TriggerUpdateInput;
}
