/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppCitiesQueryData
// ====================================================

export interface AppCitiesQueryData_getApp_city_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppCitiesQueryData_getApp_city_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppCitiesQueryData_getApp_city_stats_result[];
}

export interface AppCitiesQueryData_getApp {
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
   * Cities
   */
  city_stats: AppCitiesQueryData_getApp_city_stats;
}

export interface AppCitiesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppCitiesQueryData_getApp;
}

export interface AppCitiesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
