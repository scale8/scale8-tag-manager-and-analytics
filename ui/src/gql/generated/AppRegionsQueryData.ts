/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppRegionsQueryData
// ====================================================

export interface AppRegionsQueryData_getApp_region_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppRegionsQueryData_getApp_region_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppRegionsQueryData_getApp_region_stats_result[];
}

export interface AppRegionsQueryData_getApp {
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
   * Regions
   */
  region_stats: AppRegionsQueryData_getApp_region_stats;
}

export interface AppRegionsQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppRegionsQueryData_getApp;
}

export interface AppRegionsQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
