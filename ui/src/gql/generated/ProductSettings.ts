/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProductSettings
// ====================================================

export interface ProductSettings_getOrg_tag_manager_account {
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
}

export interface ProductSettings_getOrg_data_manager_account {
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
}

export interface ProductSettings_getOrg_me {
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
}

export interface ProductSettings_getOrg {
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
   * If this org has a stripeCustomerId and can use the custumer portal
   */
  has_billing: boolean;
  /**
   * If the org is under manual invoicing
   */
  manual_invoicing: boolean;
  /**
   * A `TagManagerAccount` associated with this `Org`. A Scale8 Tag Manager account
   * might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  tag_manager_account: ProductSettings_getOrg_tag_manager_account | null;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: ProductSettings_getOrg_data_manager_account | null;
  /**
   * `OrgUser` representation of current `User`
   */
  me: ProductSettings_getOrg_me;
}

export interface ProductSettings {
  /**
   * @bound=Org
   * Given a valid `Org` ID, this function will return an `Org` provided the API
   * `User` has been granted at least **view** access.
   */
  getOrg: ProductSettings_getOrg;
}

export interface ProductSettingsVariables {
  id: string;
}
