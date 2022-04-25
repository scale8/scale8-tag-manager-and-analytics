/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PlatformType } from "./globalTypes";

// ====================================================
// GraphQL query operation: NavPlatformRevisionDataContainer
// ====================================================

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_data_containers {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * Name of the `PlatformDataContainer`
   */
  name: string;
}

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_platforms {
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

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_tag_manager_account {
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

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_data_manager_account {
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

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_me_permissions {
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

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_me_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required
   * to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
}

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org {
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
  tag_manager_account: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_tag_manager_account;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_data_manager_account;
  /**
   * `OrgUser` representation of current `User`
   */
  me: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org_me;
}

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  platforms: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_platforms[];
  org: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account_org;
  /**
   * If the account is enabled
   */
  enabled: boolean;
}

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_platform_revisions {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The name of the `PlatformRevision`
   */
  name: string;
}

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform {
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
  tag_manager_account: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_tag_manager_account;
  /**
   * `PlatformRevision`s the are linked to this `Platform`. Please note that if the
   * `Platform` has been made public and `PlatformRevision` has been published, it
   * will be avalible to ***any*** Scale8 Tag Manager User to install in their `App`
   */
  platform_revisions: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_platform_revisions[];
}

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The name of the `PlatformRevision`
   */
  name: string;
  /**
   * A list of data containers (data layers) that are associated with this `PlatformRevision`
   */
  platform_data_containers: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform_data_containers[];
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision_platform;
}

export interface NavPlatformRevisionDataContainer_getPlatformDataContainer {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * Name of the `PlatformDataContainer`
   */
  name: string;
  /**
   * `PlatformRevision` that contains this `PlatformDataContainer`
   */
  platform_revision: NavPlatformRevisionDataContainer_getPlatformDataContainer_platform_revision;
}

export interface NavPlatformRevisionDataContainer_me_orgs {
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

export interface NavPlatformRevisionDataContainer_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavPlatformRevisionDataContainer_me_orgs[];
}

export interface NavPlatformRevisionDataContainer {
  /**
   * @bound=PlatformDataContainer
   * Method will return a `PlatformDataContainer` instance from its ID.
   */
  getPlatformDataContainer: NavPlatformRevisionDataContainer_getPlatformDataContainer;
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavPlatformRevisionDataContainer_me;
}

export interface NavPlatformRevisionDataContainerVariables {
  id: string;
}
