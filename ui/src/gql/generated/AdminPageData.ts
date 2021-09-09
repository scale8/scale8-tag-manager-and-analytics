/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminPageData
// ====================================================

export interface AdminPageData_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * Whether the `User` is an admin
   */
  is_admin: boolean;
}

export interface AdminPageData {
  /**
   * @bound=User
   * Get a the session user
   */
  me: AdminPageData_me;
}
