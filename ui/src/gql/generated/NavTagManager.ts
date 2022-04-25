/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NavTagManager
// ====================================================

export interface NavTagManager_getTagManagerAccount_org_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  /**
   * The amount of days until the trial expires
   */
  trial_expires_in: number;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavTagManager_getTagManagerAccount_org_data_manager_account {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
  /**
   * The amount of days until the trial expires
   */
  trial_expires_in: number;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavTagManager_getTagManagerAccount_org_me_permissions {
  __typename: "OrgUserPermissions";
  /**
   * `Org` user is able to view the org entities
   */
  can_view: boolean;
  /**
   * `Org` user is able to create new entities
   */
  can_create: boolean;
  /**
   * `Org` user is able to edit entities
   */
  can_edit: boolean;
  /**
   * `Org` user is able to delete entities
   */
  can_delete: boolean;
  /**
   * `Org` user has admin level access
   */
  is_admin: boolean;
}

export interface NavTagManager_getTagManagerAccount_org_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: NavTagManager_getTagManagerAccount_org_me_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required
   * to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
}

export interface NavTagManager_getTagManagerAccount_org {
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
  tag_manager_account: NavTagManager_getTagManagerAccount_org_tag_manager_account;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: NavTagManager_getTagManagerAccount_org_data_manager_account;
  /**
   * `OrgUser` representation of current `User`
   */
  me: NavTagManager_getTagManagerAccount_org_me;
}

export interface NavTagManager_getTagManagerAccount {
  __typename: "TagManagerAccount";
  id: string;
  org: NavTagManager_getTagManagerAccount_org;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavTagManager_me_orgs {
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

export interface NavTagManager_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavTagManager_me_orgs[];
}

export interface NavTagManager {
  /**
   * @bound=TagManagerAccount
   */
  getTagManagerAccount: NavTagManager_getTagManagerAccount;
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavTagManager_me;
}

export interface NavTagManagerVariables {
  id: string;
}
