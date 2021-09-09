/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppEntryPagesQueryData
// ====================================================

export interface AppEntryPagesQueryData_getApp_entry_page_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppEntryPagesQueryData_getApp_entry_page_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppEntryPagesQueryData_getApp_entry_page_stats_result[];
}

export interface AppEntryPagesQueryData_getApp {
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
   * Entry Pages
   */
  entry_page_stats: AppEntryPagesQueryData_getApp_entry_page_stats;
}

export interface AppEntryPagesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppEntryPagesQueryData_getApp;
}

export interface AppEntryPagesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
