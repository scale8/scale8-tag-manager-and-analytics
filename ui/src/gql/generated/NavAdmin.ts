/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NavAdmin
// ====================================================

export interface NavAdmin_me_orgs {
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

export interface NavAdmin_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavAdmin_me_orgs[];
}

export interface NavAdmin {
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavAdmin_me;
}
