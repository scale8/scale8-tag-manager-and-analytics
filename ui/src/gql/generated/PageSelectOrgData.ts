/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageSelectOrgData
// ====================================================

export interface PageSelectOrgData_me_invites {
  __typename: "Invite";
  /**
   * Unique `Invite` id for this operation
   */
  id: string;
}

export interface PageSelectOrgData_me_orgs_tag_manager_account_apps {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
}

export interface PageSelectOrgData_me_orgs_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  apps: PageSelectOrgData_me_orgs_tag_manager_account_apps[];
}

export interface PageSelectOrgData_me_orgs_data_manager_account {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
}

export interface PageSelectOrgData_me_orgs {
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
   * A `TagManagerAccount` associated with this `Org`. A Scale8 Tag Manager account might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  tag_manager_account: PageSelectOrgData_me_orgs_tag_manager_account | null;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager account might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  data_manager_account: PageSelectOrgData_me_orgs_data_manager_account | null;
}

export interface PageSelectOrgData_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Invite`s the `User` has sent
   */
  invites: PageSelectOrgData_me_invites[];
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: PageSelectOrgData_me_orgs[];
}

export interface PageSelectOrgData {
  /**
   * @bound=User
   * Get a the session user
   */
  me: PageSelectOrgData_me;
}
