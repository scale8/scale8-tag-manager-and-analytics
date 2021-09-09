/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateAppRevisionGetData
// ====================================================

export interface UpdateAppRevisionGetData_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
}

export interface UpdateAppRevisionGetData {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: UpdateAppRevisionGetData_getRevision;
}

export interface UpdateAppRevisionGetDataVariables {
  id: string;
}
