/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppSummaryQueryData
// ====================================================

export interface AppSummaryQueryData_getApp_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppSummaryQueryData_getApp_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppSummaryQueryData_getApp_event_request_stats_result[];
}

export interface AppSummaryQueryData_getApp_prev_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppSummaryQueryData_getApp_prev_request_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppSummaryQueryData_getApp_prev_request_stats_result[];
}

export interface AppSummaryQueryData_getApp_average_session_duration_stats {
  __typename: "IntResponse";
  result: number;
}

export interface AppSummaryQueryData_getApp_prev_average_session_duration {
  __typename: "IntResponse";
  result: number;
}

export interface AppSummaryQueryData_getApp_bounce_ratio_stats {
  __typename: "FloatResponse";
  result: number;
}

export interface AppSummaryQueryData_getApp_prev_bounce_ratio {
  __typename: "FloatResponse";
  result: number;
}

export interface AppSummaryQueryData_getApp {
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
  event_request_stats: AppSummaryQueryData_getApp_event_request_stats;
  /**
   * Event request stats
   */
  prev_request_stats: AppSummaryQueryData_getApp_prev_request_stats;
  /**
   * Average session duration
   */
  average_session_duration_stats: AppSummaryQueryData_getApp_average_session_duration_stats;
  /**
   * Average session duration
   */
  prev_average_session_duration: AppSummaryQueryData_getApp_prev_average_session_duration;
  /**
   * Bounce ratio
   */
  bounce_ratio_stats: AppSummaryQueryData_getApp_bounce_ratio_stats;
  /**
   * Bounce ratio
   */
  prev_bounce_ratio: AppSummaryQueryData_getApp_prev_bounce_ratio;
}

export interface AppSummaryQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppSummaryQueryData_getApp;
}

export interface AppSummaryQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
  appQueryOptionsPrev: AppQueryOptions;
}
