/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NavGlobalAction
// ====================================================

export interface NavGlobalAction_getActionGroupDistribution_revision_global_action_group_distributions {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
  /**
   * `ActionGroupDistribution` name
   */
  name: string;
}

export interface NavGlobalAction_getActionGroupDistribution_revision_app_revisions {
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

export interface NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_apps {
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

export interface NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_tag_manager_account {
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

export interface NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account {
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

export interface NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_me_permissions {
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

export interface NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * `OrgUser`'s permissions as described in `OrgUserPermissions`
   */
  permissions: NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_me_permissions;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
  can_create_tag_manager_trial: boolean;
  can_create_data_manager_trial: boolean;
}

export interface NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org {
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
  tag_manager_account: NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_tag_manager_account | null;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager account might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  data_manager_account: NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_data_manager_account | null;
  /**
   * `OrgUser` representation of current `User`
   */
  me: NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org_me;
}

export interface NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  apps: NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_apps[];
  org: NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account_org;
}

export interface NavGlobalAction_getActionGroupDistribution_revision_app {
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
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: NavGlobalAction_getActionGroupDistribution_revision_app_revisions[];
  /**
   * The `TagManagerAccount` that contains the `App`
   */
  tag_manager_account: NavGlobalAction_getActionGroupDistribution_revision_app_tag_manager_account;
}

export interface NavGlobalAction_getActionGroupDistribution_revision {
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
  global_action_group_distributions: NavGlobalAction_getActionGroupDistribution_revision_global_action_group_distributions[];
  /**
   * App
   */
  app: NavGlobalAction_getActionGroupDistribution_revision_app;
}

export interface NavGlobalAction_getActionGroupDistribution {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
  /**
   * `ActionGroupDistribution` name
   */
  name: string;
  /**
   * Revision
   */
  revision: NavGlobalAction_getActionGroupDistribution_revision;
}

export interface NavGlobalAction_me_orgs {
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

export interface NavGlobalAction_me {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
  /**
   * List of `Org`s the `User` has access to
   */
  orgs: NavGlobalAction_me_orgs[];
}

export interface NavGlobalAction {
  /**
   * @bound=ActionGroupDistribution
   * Get a `ActionGroupDistribution` model from the `ActionGroupDistribution` ID
   */
  getActionGroupDistribution: NavGlobalAction_getActionGroupDistribution;
  /**
   * @bound=User
   * Get a the session user
   */
  me: NavGlobalAction_me;
}

export interface NavGlobalActionVariables {
  id: string;
}
