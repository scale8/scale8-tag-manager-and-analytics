/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TriggerDuplicateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicateGlobalTrigger
// ====================================================

export interface DuplicateGlobalTrigger_duplicateTrigger {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
}

export interface DuplicateGlobalTrigger {
  /**
   * @bound=Trigger
   * Duplicate a `Trigger`. The duplicated will copy everything beneath `Trigger`, creating a new `Trigger` entity and linking it back to the same parent entity.
   */
  duplicateTrigger: DuplicateGlobalTrigger_duplicateTrigger;
}

export interface DuplicateGlobalTriggerVariables {
  triggerDuplicateInput: TriggerDuplicateInput;
}
