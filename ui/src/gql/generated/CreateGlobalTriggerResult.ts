/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TriggerCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateGlobalTriggerResult
// ====================================================

export interface CreateGlobalTriggerResult_createTrigger {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
}

export interface CreateGlobalTriggerResult {
  /**
   * @bound=Trigger
   * Create a new `Trigger`
   */
  createTrigger: CreateGlobalTriggerResult_createTrigger;
}

export interface CreateGlobalTriggerResultVariables {
  triggerCreateInput: TriggerCreateInput;
}
