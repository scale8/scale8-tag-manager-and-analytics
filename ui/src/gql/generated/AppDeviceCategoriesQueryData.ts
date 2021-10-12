/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppDeviceCategoriesQueryData
// ====================================================

export interface AppDeviceCategoriesQueryData_getApp_device_category_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppDeviceCategoriesQueryData_getApp_device_category_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppDeviceCategoriesQueryData_getApp_device_category_stats_result[];
}

export interface AppDeviceCategoriesQueryData_getApp {
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
   * Device Categories
   */
  device_category_stats: AppDeviceCategoriesQueryData_getApp_device_category_stats;
}

export interface AppDeviceCategoriesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppDeviceCategoriesQueryData_getApp;
}

export interface AppDeviceCategoriesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
