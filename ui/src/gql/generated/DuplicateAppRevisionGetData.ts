/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateAppRevisionGetData
// ====================================================

export interface DuplicateAppRevisionGetData_getRevision {
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

export interface DuplicateAppRevisionGetData {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: DuplicateAppRevisionGetData_getRevision;
}

export interface DuplicateAppRevisionGetDataVariables {
  id: string;
}
