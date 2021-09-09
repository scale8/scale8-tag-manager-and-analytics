/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NavDataManager
// ====================================================

export interface NavDataManager_getDataManagerAccount_org_tag_manager_account {
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
}

export interface NavDataManager_getDataManagerAccount_org_data_manager_account {
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
}

export interface NavDataManager_getDataManagerAccount_org_me_permissions {
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

export interface NavDataManager_getDataManagerAccount_org_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: NavDataManager_getDataManagerAccount_org_me_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
  can_create_tag_manager_trial: boolean;
  can_create_data_manager_trial: boolean;
}

export interface NavDataManager_getDataManagerAccount_org {
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
  tag_manager_account: NavDataManager_getDataManagerAccount_org_tag_manager_account | null;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager account might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  data_manager_account: NavDataManager_getDataManagerAccount_org_data_manager_account | null;
  /**
   * `OrgUser` representation of current `User`
   */
  me: NavDataManager_getDataManagerAccount_org_me;
}

export interface NavDataManager_getDataManagerAccount {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
  /**
   * `Org` that owns this `DataManagerAccount`
   */
  org: NavDataManager_getDataManagerAccount_org;
}

export interface NavDataManager_me_orgs {
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

export interface NavDataManager_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavDataManager_me_orgs[];
}

export interface NavDataManager {
  /**
   * @bound=DataManagerAccount
   * Returns a `DataManagerAccount` instance provided a valid ID is given and the user has sufficient priviledges to view it.
   */
  getDataManagerAccount: NavDataManager_getDataManagerAccount;
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavDataManager_me;
}

export interface NavDataManagerVariables {
  id: string;
}
