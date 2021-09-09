/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: userOrgList
// ====================================================

export interface userOrgList_orgs {
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

export interface userOrgList {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: userOrgList_orgs[];
}
