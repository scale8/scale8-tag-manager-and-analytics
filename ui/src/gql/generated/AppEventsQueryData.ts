/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppEventsQueryData
// ====================================================

export interface AppEventsQueryData_getApp_event_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppEventsQueryData_getApp_event_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppEventsQueryData_getApp_event_stats_result[];
}

export interface AppEventsQueryData_getApp_event_group_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppEventsQueryData_getApp_event_group_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppEventsQueryData_getApp_event_group_stats_result[];
}

export interface AppEventsQueryData_getApp {
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
   * Events
   */
  event_stats: AppEventsQueryData_getApp_event_stats;
  /**
   * Event Groups
   */
  event_group_stats: AppEventsQueryData_getApp_event_group_stats;
}

export interface AppEventsQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppEventsQueryData_getApp;
}

export interface AppEventsQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
  appQueryOptionsGroup: AppQueryOptions;
}
