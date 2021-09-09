/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppDevicesQueryData
// ====================================================

export interface AppDevicesQueryData_getApp_device_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppDevicesQueryData_getApp_device_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppDevicesQueryData_getApp_device_stats_result[];
}

export interface AppDevicesQueryData_getApp {
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
   * Devices
   */
  device_stats: AppDevicesQueryData_getApp_device_stats;
}

export interface AppDevicesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppDevicesQueryData_getApp;
}

export interface AppDevicesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
