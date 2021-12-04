/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateGlobalTriggerGetData
// ====================================================

export interface DuplicateGlobalTriggerGetData_getTrigger {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * The name of the `Trigger`
   */
  name: string;
}

export interface DuplicateGlobalTriggerGetData {
  /**
   * @bound=Trigger
   * Get a `Trigger` model from the `Trigger` ID
   */
  getTrigger: DuplicateGlobalTriggerGetData_getTrigger;
}

export interface DuplicateGlobalTriggerGetDataVariables {
  id: string;
}
