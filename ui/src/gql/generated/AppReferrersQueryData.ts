/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppReferrersQueryData
// ====================================================

export interface AppReferrersQueryData_getApp_referrer_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppReferrersQueryData_getApp_referrer_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppReferrersQueryData_getApp_referrer_stats_result[];
}

export interface AppReferrersQueryData_getApp_referrer_tld_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppReferrersQueryData_getApp_referrer_tld_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppReferrersQueryData_getApp_referrer_tld_stats_result[];
}

export interface AppReferrersQueryData_getApp {
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
   * Referrers
   */
  referrer_stats: AppReferrersQueryData_getApp_referrer_stats;
  /**
   * Referrer TLDs
   */
  referrer_tld_stats: AppReferrersQueryData_getApp_referrer_tld_stats;
}

export interface AppReferrersQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppReferrersQueryData_getApp;
}

export interface AppReferrersQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
