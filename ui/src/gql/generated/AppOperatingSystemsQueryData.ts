/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppOperatingSystemsQueryData
// ====================================================

export interface AppOperatingSystemsQueryData_getApp_operating_system_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppOperatingSystemsQueryData_getApp_operating_system_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppOperatingSystemsQueryData_getApp_operating_system_stats_result[];
}

export interface AppOperatingSystemsQueryData_getApp {
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
   * Operating Systems
   */
  operating_system_stats: AppOperatingSystemsQueryData_getApp_operating_system_stats;
}

export interface AppOperatingSystemsQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppOperatingSystemsQueryData_getApp;
}

export interface AppOperatingSystemsQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
