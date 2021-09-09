/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageAdminDashboardData
// ====================================================

export interface PageAdminDashboardData_me {
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

export interface PageAdminDashboardData {
  /**
   * @bound=User
   * Get a the session user
   */
  me: PageAdminDashboardData_me;
}
