/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateTagGetData
// ====================================================

export interface DuplicateTagGetData_getTag {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
  /**
   * Tag name
   */
  name: string;
}

export interface DuplicateTagGetData {
  /**
   * @bound=Tag
   * Get an Tag model from the Tag ID
   */
  getTag: DuplicateTagGetData_getTag;
}

export interface DuplicateTagGetDataVariables {
  id: string;
}
