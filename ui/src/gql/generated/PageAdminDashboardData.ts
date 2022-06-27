/* tslint:disable */
/* eslint-disable */
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

export interface PageAdminDashboardData_getOrgs {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
}

export interface PageAdminDashboardData {
  /**
   * @bound=User
   * Get a the session user
   */
  me: PageAdminDashboardData_me;
  /**
   * @bound=Org
   * This function will return a list of all `Org`s, available only if the user is an admin.
   */
  getOrgs: PageAdminDashboardData_getOrgs[];
}
