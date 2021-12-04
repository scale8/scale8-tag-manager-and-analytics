/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StorageProvider } from "./globalTypes";

// ====================================================
// GraphQL query operation: NavGlobalTrigger
// ====================================================

export interface NavGlobalTrigger_getTrigger_revision_global_triggers {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * The name of the `Trigger`
   */
  name: string;
}

export interface NavGlobalTrigger_getTrigger_revision_app_revisions {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
}

export interface NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_apps {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Name of the Application
   */
  name: string;
}

export interface NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_tag_manager_account {
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

export interface NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_data_manager_account {
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

export interface NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_me_permissions {
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

export interface NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_me_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required
   * to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
  can_create_tag_manager_trial: boolean;
  can_create_data_manager_trial: boolean;
}

export interface NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org {
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
  tag_manager_account: NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_tag_manager_account | null;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_data_manager_account | null;
  /**
   * `OrgUser` representation of current `User`
   */
  me: NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org_me;
}

export interface NavGlobalTrigger_getTrigger_revision_app_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  apps: NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_apps[];
  org: NavGlobalTrigger_getTrigger_revision_app_tag_manager_account_org;
}

export interface NavGlobalTrigger_getTrigger_revision_app {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Name of the Application
   */
  name: string;
  /**
   * Whether the analytics on the `App` is enabled
   */
  analytics_enabled: boolean;
  /**
   * Whether the error tracking on the `App` is enabled
   */
  error_tracking_enabled: boolean;
  /**
   * The storage provider used by the `App` to track data
   */
  storage_provider: StorageProvider;
  /**
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: NavGlobalTrigger_getTrigger_revision_app_revisions[];
  /**
   * The `TagManagerAccount` that contains the `App`
   */
  tag_manager_account: NavGlobalTrigger_getTrigger_revision_app_tag_manager_account;
}

export interface NavGlobalTrigger_getTrigger_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Get all the global triggers linked to this revision
   */
  global_triggers: NavGlobalTrigger_getTrigger_revision_global_triggers[];
  /**
   * App
   */
  app: NavGlobalTrigger_getTrigger_revision_app;
}

export interface NavGlobalTrigger_getTrigger {
  __typename: "Trigger";
  /**
   * The ID of the `Trigger`
   */
  id: string;
  /**
   * The name of the `Trigger`
   */
  name: string;
  /**
   * Revision
   */
  revision: NavGlobalTrigger_getTrigger_revision;
}

export interface NavGlobalTrigger_me_orgs {
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

export interface NavGlobalTrigger_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavGlobalTrigger_me_orgs[];
}

export interface NavGlobalTrigger {
  /**
   * @bound=Trigger
   * Get a `Trigger` model from the `Trigger` ID
   */
  getTrigger: NavGlobalTrigger_getTrigger;
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavGlobalTrigger_me;
}

export interface NavGlobalTriggerVariables {
  id: string;
}
