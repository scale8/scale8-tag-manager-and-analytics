/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions, IngestQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: OrgDashboardPageData
// ====================================================

export interface OrgDashboardPageData_getOrg_tag_manager_account_apps_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface OrgDashboardPageData_getOrg_tag_manager_account_apps_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: OrgDashboardPageData_getOrg_tag_manager_account_apps_event_request_stats_result[];
}

export interface OrgDashboardPageData_getOrg_tag_manager_account_apps {
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
   * Event request stats
   */
  event_request_stats: OrgDashboardPageData_getOrg_tag_manager_account_apps_event_request_stats;
}

export interface OrgDashboardPageData_getOrg_tag_manager_account {
  __typename: "TagManagerAccount";
  id: string;
  apps: OrgDashboardPageData_getOrg_tag_manager_account_apps[];
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

export interface OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_request_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_request_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_request_stats_result[];
}

export interface OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_byte_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_byte_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_byte_stats_result[];
}

export interface OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * Name of the `IngestEndpoint`
   */
  name: string;
  /**
   * Request stats
   */
  request_stats: OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_request_stats;
  /**
   * Byte stats
   */
  byte_stats: OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints_byte_stats;
}

export interface OrgDashboardPageData_getOrg_data_manager_account {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
  /**
   * A list of `IngestEndpoint`s linked to the `DataManagerAccount`
   */
  ingest_endpoints: OrgDashboardPageData_getOrg_data_manager_account_ingest_endpoints[];
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

export interface OrgDashboardPageData_getOrg_me {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
}

export interface OrgDashboardPageData_getOrg_users {
  __typename: "OrgUser";
  /**
   * `OrgUser` ID
   */
  id: string;
}

export interface OrgDashboardPageData_getOrg {
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
  tag_manager_account: OrgDashboardPageData_getOrg_tag_manager_account | null;
  /**
   * A `DataManagerAccount` associated with this `Org`. A Scale8 Data Manager
   * account might not exist yet unless a trial has been requested or product has
   * been subscribed to.
   */
  data_manager_account: OrgDashboardPageData_getOrg_data_manager_account | null;
  /**
   * `OrgUser` representation of current `User`
   */
  me: OrgDashboardPageData_getOrg_me;
  /**
   * List of `OrgUser`'s associated with this `Org`
   */
  users: OrgDashboardPageData_getOrg_users[];
}

export interface OrgDashboardPageData {
  /**
   * @bound=Org
   * Given a valid `Org` ID, this function will return an `Org` provided the API
   * `User` has been granted at least **view** access.
   */
  getOrg: OrgDashboardPageData_getOrg;
}

export interface OrgDashboardPageDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
  ingestQueryOptions: IngestQueryOptions;
}
