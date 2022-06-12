/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrgsAdminPageData
// ====================================================

export interface OrgsAdminPageData_me_orgs {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
}

export interface OrgsAdminPageData_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * Whether the `User` is an admin
   */
  is_admin: boolean;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: OrgsAdminPageData_me_orgs[];
}

export interface OrgsAdminPageData_getOrgs {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
  /**
   * Name used to describe the `Org`
   */
  name: string;
  /**
   * DateTime the `Org` was last updated
   */
  updated_at: S8DateTime;
  /**
   * DateTime the `Org` was created
   */
  created_at: S8DateTime;
}

export interface OrgsAdminPageData {
  /**
   * @bound=User
   * Get a the session user
   */
  me: OrgsAdminPageData_me;
  /**
   * @bound=Org
   * This function will return a list of all `Org`s, available only if the user is an admin.
   */
  getOrgs: OrgsAdminPageData_getOrgs[];
}
