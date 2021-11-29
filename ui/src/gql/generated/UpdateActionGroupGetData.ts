/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateActionGroupGetData
// ====================================================

export interface UpdateActionGroupGetData_getActionGroup {
  __typename: "ActionGroup";
  /**
   * `ActionGroup` ID
   */
  id: string;
  /**
   * `ActionGroup` name
   */
  name: string;
}

export interface UpdateActionGroupGetData {
  /**
   * @bound=ActionGroup
   * Get a `ActionGroup` model from the `ActionGroup` ID
   */
  getActionGroup: UpdateActionGroupGetData_getActionGroup;
}

export interface UpdateActionGroupGetDataVariables {
  id: string;
}
