/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PlatformType } from "./globalTypes";

// ====================================================
// GraphQL query operation: NavPlatform
// ====================================================

export interface NavPlatform_getPlatform_tag_manager_account_platforms {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
  /**
   * Platform type
   */
  type: PlatformType;
}

export interface NavPlatform_getPlatform_tag_manager_account_org_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  /**
   * The amount of days until the trial expires
   */
  trial_expires_in: number;
  /**
   * If the free trial is expired
   */
  trial_expired: boolean;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavPlatform_getPlatform_tag_manager_account_org_data_manager_account {
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
   * If the free trial is expired
   */
  trial_expired: boolean;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavPlatform_getPlatform_tag_manager_account_org_me_permissions {
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

export interface NavPlatform_getPlatform_tag_manager_account_org_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: NavPlatform_getPlatform_tag_manager_account_org_me_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required
   * to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
}

export interface NavPlatform_getPlatform_tag_manager_account_org {
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
  tag_manager_account: NavPlatform_getPlatform_tag_manager_account_org_tag_manager_account;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: NavPlatform_getPlatform_tag_manager_account_org_data_manager_account;
  /**
   * `OrgUser` representation of current `User`
   */
  me: NavPlatform_getPlatform_tag_manager_account_org_me;
}

export interface NavPlatform_getPlatform_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  platforms: NavPlatform_getPlatform_tag_manager_account_platforms[];
  org: NavPlatform_getPlatform_tag_manager_account_org;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavPlatform_getPlatform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
  /**
   * The `TagManagerAccount` that contains this `Platform`
   */
  tag_manager_account: NavPlatform_getPlatform_tag_manager_account;
}

export interface NavPlatform_me_orgs {
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

export interface NavPlatform_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavPlatform_me_orgs[];
}

export interface NavPlatform {
  /**
   * @bound=Platform
   * Method will return a `Platform` instance from its ID.
   * 
   * !> Note that if the `Platform` has been made public, it will be accessible to ***any*** Scale8 Tag Manager User.
   */
  getPlatform: NavPlatform_getPlatform;
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavPlatform_me;
}

export interface NavPlatformVariables {
  id: string;
}
