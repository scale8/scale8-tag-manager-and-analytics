/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppUtmSourceQueryData
// ====================================================

export interface AppUtmSourceQueryData_getApp_utm_source_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppUtmSourceQueryData_getApp_utm_source_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppUtmSourceQueryData_getApp_utm_source_stats_result[];
}

export interface AppUtmSourceQueryData_getApp {
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
   * UTM Sources
   */
  utm_source_stats: AppUtmSourceQueryData_getApp_utm_source_stats;
}

export interface AppUtmSourceQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppUtmSourceQueryData_getApp;
}

export interface AppUtmSourceQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
