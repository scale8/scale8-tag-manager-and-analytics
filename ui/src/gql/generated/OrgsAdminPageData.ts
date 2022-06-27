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

export interface OrgsAdminPageData_getOrgs_tag_manager_account_current_billing_cycle_usage {
  __typename: "TagManagerAccountUsage";
  request_count: number;
}

export interface OrgsAdminPageData_getOrgs_tag_manager_account {
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
   * The current product id associated with this account. If this is free plan or managed, this will not be provided
   */
  stripe_product_id: string | null;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
  /**
   * Current billing cycle usage
   */
  current_billing_cycle_usage: OrgsAdminPageData_getOrgs_tag_manager_account_current_billing_cycle_usage;
}

export interface OrgsAdminPageData_getOrgs_data_manager_account_current_billing_cycle_usage {
  __typename: "DataManagerAccountUsage";
  request_count: number;
  byte_count: number;
}

export interface OrgsAdminPageData_getOrgs_data_manager_account {
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
   * The current product id associated with this account. If this is free plan or managed, this will not be provided
   */
  stripe_product_id: string | null;
  /**
   * If the account is in a trial period
   */
  is_trial: boolean;
  /**
   * If the account is enabled
   */
  enabled: boolean;
  /**
   * Current billing cycle usage
   */
  current_billing_cycle_usage: OrgsAdminPageData_getOrgs_data_manager_account_current_billing_cycle_usage;
}

export interface OrgsAdminPageData_getOrgs_users {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
  /**
   * If the `OrgUser` currently has ownership of this `Org`. Ownership is required
   * to manage billing, upgrades, downgrades and termination of an Org.
   */
  owner: boolean;
  /**
   * `OrgUser`'s email address
   */
  email: string;
  /**
   * `OrgUser`'s first name
   */
  first_name: string;
  /**
   * `OrgUser`'s last name
   */
  last_name: string;
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
   * If this org is subscribed to any of the Scale8 services
   */
  is_paid: boolean;
  /**
   * If this org has a stripeCustomerId and can use the costumer portal
   */
  has_billing: boolean;
  /**
   * If the org is under manual invoicing
   */
  manual_invoicing: boolean;
  /**
   * The billing cycle start
   */
  billing_start: S8DateTime | null;
  /**
   * The billing cycle end
   */
  billing_end: S8DateTime | null;
  /**
   * A `TagManagerAccount` associated with this `Org`. A Scale8 Tag Manager account
   * might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  tag_manager_account: OrgsAdminPageData_getOrgs_tag_manager_account;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: OrgsAdminPageData_getOrgs_data_manager_account;
  /**
   * List of `OrgUser`'s associated with this `Org`
   */
  users: OrgsAdminPageData_getOrgs_users[];
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
