/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateGlobalTriggerGetData
// ====================================================

export interface UpdateGlobalTriggerGetData_getTrigger {
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

export interface UpdateGlobalTriggerGetData {
  /**
   * @bound=Trigger
   * Get a `Trigger` model from the `Trigger` ID
   */
  getTrigger: UpdateGlobalTriggerGetData_getTrigger;
}

export interface UpdateGlobalTriggerGetDataVariables {
  id: string;
}
