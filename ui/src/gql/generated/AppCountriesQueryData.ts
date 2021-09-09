/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppCountriesQueryData
// ====================================================

export interface AppCountriesQueryData_getApp_country_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppCountriesQueryData_getApp_country_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppCountriesQueryData_getApp_country_stats_result[];
}

export interface AppCountriesQueryData_getApp {
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
   * Countries
   */
  country_stats: AppCountriesQueryData_getApp_country_stats;
}

export interface AppCountriesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppCountriesQueryData_getApp;
}

export interface AppCountriesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
