/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateOrgGetData
// ====================================================

export interface UpdateOrgGetData_getOrg {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
  /**
   * Name used to describe the `Org`
   */
  name: string;
}

export interface UpdateOrgGetData {
  /**
   * @bound=Org
   * Given a valid `Org` ID, this function will return an `Org` provided the API
   * `User` has been granted at least **view** access.
   */
  getOrg: UpdateOrgGetData_getOrg;
}

export interface UpdateOrgGetDataVariables {
  id: string;
}
