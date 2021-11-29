/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppChartQueryData
// ====================================================

export interface AppChartQueryData_getApp_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppChartQueryData_getApp_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: AppChartQueryData_getApp_event_request_stats_result[];
}

export interface AppChartQueryData_getApp {
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
  event_request_stats: AppChartQueryData_getApp_event_request_stats;
}

export interface AppChartQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppChartQueryData_getApp;
}

export interface AppChartQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
