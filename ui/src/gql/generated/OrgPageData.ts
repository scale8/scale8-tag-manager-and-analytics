/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrgPageData
// ====================================================

export interface OrgPageData_me_orgs_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
}

export interface OrgPageData_me_orgs_data_manager_account {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
}

export interface OrgPageData_me_orgs_users {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
}

export interface OrgPageData_me_orgs {
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
   * A `TagManagerAccount` associated with this `Org`. A Scale8 Tag Manager account
   * might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  tag_manager_account: OrgPageData_me_orgs_tag_manager_account | null;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: OrgPageData_me_orgs_data_manager_account | null;
  /**
   * List of `OrgUser`'s associated with this `Org`
   */
  users: OrgPageData_me_orgs_users[];
  /**
   * DateTime the `Org` was created
   */
  created_at: S8DateTime;
  /**
   * DateTime the `Org` was last updated
   */
  updated_at: S8DateTime;
}

export interface OrgPageData_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: OrgPageData_me_orgs[];
}

export interface OrgPageData {
  /**
   * @bound=User
   * Get a the session user
   */
  me: OrgPageData_me;
}
