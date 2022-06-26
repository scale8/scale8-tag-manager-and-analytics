/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AlignSubscriptionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AlignSubscriptionDataManager
// ====================================================

export interface AlignSubscriptionDataManager_alignSubscription_tag_manager_account {
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
}

export interface AlignSubscriptionDataManager_alignSubscription_data_manager_account {
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
}

export interface AlignSubscriptionDataManager_alignSubscription {
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
   * A `TagManagerAccount` associated with this `Org`. A Scale8 Tag Manager account
   * might not exist yet unless a trial has been requested or product has been subscribed to.
   */
  tag_manager_account: AlignSubscriptionDataManager_alignSubscription_tag_manager_account;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: AlignSubscriptionDataManager_alignSubscription_data_manager_account;
}

export interface AlignSubscriptionDataManager {
  /**
   * @bound=Org
   * Aligns the accounts and org details to the payment method subscription.
   */
  alignSubscription: AlignSubscriptionDataManager_alignSubscription;
}

export interface AlignSubscriptionDataManagerVariables {
  alignSubscriptionInput?: AlignSubscriptionInput | null;
}
