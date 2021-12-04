/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppPagesQueryData
// ====================================================

export interface AppPagesQueryData_getApp_page_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppPagesQueryData_getApp_page_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppPagesQueryData_getApp_page_stats_result[];
}

export interface AppPagesQueryData_getApp {
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
   * Pages
   */
  page_stats: AppPagesQueryData_getApp_page_stats;
}

export interface AppPagesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppPagesQueryData_getApp;
}

export interface AppPagesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
