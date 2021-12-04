/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppUtmMediumQueryData
// ====================================================

export interface AppUtmMediumQueryData_getApp_utm_medium_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppUtmMediumQueryData_getApp_utm_medium_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppUtmMediumQueryData_getApp_utm_medium_stats_result[];
}

export interface AppUtmMediumQueryData_getApp {
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
   * UTM Mediums
   */
  utm_medium_stats: AppUtmMediumQueryData_getApp_utm_medium_stats;
}

export interface AppUtmMediumQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppUtmMediumQueryData_getApp;
}

export interface AppUtmMediumQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
