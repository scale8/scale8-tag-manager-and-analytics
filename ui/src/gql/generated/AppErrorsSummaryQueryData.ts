/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppErrorsSummaryQueryData
// ====================================================

export interface AppErrorsSummaryQueryData_getApp_error_stats_result {
  __typename: "AppGroupingErrors";
  user_count: number;
  event_count: number;
}

export interface AppErrorsSummaryQueryData_getApp_error_stats {
  __typename: "AppGroupingErrorsResponse";
  result: AppErrorsSummaryQueryData_getApp_error_stats_result[];
}

export interface AppErrorsSummaryQueryData_getApp_prev_error_stats_result {
  __typename: "AppGroupingErrors";
  user_count: number;
  event_count: number;
}

export interface AppErrorsSummaryQueryData_getApp_prev_error_stats {
  __typename: "AppGroupingErrorsResponse";
  result: AppErrorsSummaryQueryData_getApp_prev_error_stats_result[];
}

export interface AppErrorsSummaryQueryData_getApp {
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
   * Errors
   */
  error_stats: AppErrorsSummaryQueryData_getApp_error_stats;
  /**
   * Errors
   */
  prev_error_stats: AppErrorsSummaryQueryData_getApp_prev_error_stats;
}

export interface AppErrorsSummaryQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppErrorsSummaryQueryData_getApp;
}

export interface AppErrorsSummaryQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
  appQueryOptionsPrev: AppQueryOptions;
}
