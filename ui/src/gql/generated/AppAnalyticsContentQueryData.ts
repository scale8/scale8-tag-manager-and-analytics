/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppAnalyticsContentQueryData
// ====================================================

export interface AppAnalyticsContentQueryData_getApp_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppAnalyticsContentQueryData_getApp_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppAnalyticsContentQueryData_getApp_event_request_stats_result[];
}

export interface AppAnalyticsContentQueryData_getApp_environments {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
  /**
   * `Environment` name
   */
  name: string;
}

export interface AppAnalyticsContentQueryData_getApp {
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
  event_request_stats: AppAnalyticsContentQueryData_getApp_event_request_stats;
  /**
   * Environments connected to the `App`. Environments are used to create a fixed deployment of a Revision
   */
  environments: AppAnalyticsContentQueryData_getApp_environments[];
}

export interface AppAnalyticsContentQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppAnalyticsContentQueryData_getApp;
}

export interface AppAnalyticsContentQueryDataVariables {
  id: string;
}
