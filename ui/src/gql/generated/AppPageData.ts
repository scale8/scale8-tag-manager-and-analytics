/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions, AppType } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppPageData
// ====================================================

export interface AppPageData_getTagManagerAccount_apps_revisions {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
}

export interface AppPageData_getTagManagerAccount_apps_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppPageData_getTagManagerAccount_apps_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: AppPageData_getTagManagerAccount_apps_event_request_stats_result[];
}

export interface AppPageData_getTagManagerAccount_apps {
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
   * The `AppType` associated with this App. Please note that currently on WEB is supported. MOBILE_APP will be introduced soon!
   */
  type: AppType;
  /**
   * The domain name of the `App`
   */
  domain: string;
  /**
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: AppPageData_getTagManagerAccount_apps_revisions[];
  /**
   * Event request stats
   */
  event_request_stats: AppPageData_getTagManagerAccount_apps_event_request_stats;
  /**
   * Date the `App` was created
   */
  created_at: S8DateTime;
  /**
   * Date the `App` was last updated
   */
  updated_at: S8DateTime;
}

export interface AppPageData_getTagManagerAccount {
  __typename: "TagManagerAccount";
  id: string;
  apps: AppPageData_getTagManagerAccount_apps[];
}

export interface AppPageData {
  /**
   * @bound=TagManagerAccount
   */
  getTagManagerAccount: AppPageData_getTagManagerAccount;
}

export interface AppPageDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
