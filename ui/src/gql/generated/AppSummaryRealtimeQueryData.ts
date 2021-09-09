/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppSummaryRealtimeQueryData
// ====================================================

export interface AppSummaryRealtimeQueryData_getApp_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppSummaryRealtimeQueryData_getApp_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppSummaryRealtimeQueryData_getApp_event_request_stats_result[];
}

export interface AppSummaryRealtimeQueryData_getApp_prev_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppSummaryRealtimeQueryData_getApp_prev_request_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppSummaryRealtimeQueryData_getApp_prev_request_stats_result[];
}

export interface AppSummaryRealtimeQueryData_getApp_current_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppSummaryRealtimeQueryData_getApp_current_request_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppSummaryRealtimeQueryData_getApp_current_request_stats_result[];
}

export interface AppSummaryRealtimeQueryData_getApp {
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
  event_request_stats: AppSummaryRealtimeQueryData_getApp_event_request_stats;
  /**
   * Event request stats
   */
  prev_request_stats: AppSummaryRealtimeQueryData_getApp_prev_request_stats;
  /**
   * Event request stats
   */
  current_request_stats: AppSummaryRealtimeQueryData_getApp_current_request_stats;
}

export interface AppSummaryRealtimeQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppSummaryRealtimeQueryData_getApp;
}

export interface AppSummaryRealtimeQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
  appQueryOptionsPrev: AppQueryOptions;
  appQueryOptionsCurrent: AppQueryOptions;
}
