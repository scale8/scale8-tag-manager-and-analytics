/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppEnvironmentPageData
// ====================================================

export interface AppEnvironmentPageData_getApp_environments_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
}

export interface AppEnvironmentPageData_getApp_environments_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppEnvironmentPageData_getApp_environments_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: AppEnvironmentPageData_getApp_environments_event_request_stats_result[];
}

export interface AppEnvironmentPageData_getApp_environments {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
  /**
   * `Environment` name
   */
  name: string;
  /**
   * `Environment` URL
   */
  url: string | null;
  /**
   * `Environment`'s custom domain name if configured
   */
  custom_domain: string | null;
  /**
   * `Environment`'s install domain used to embed in web page
   */
  install_domain: string;
  /**
   * `Revision` currently attached to the `Environment`
   */
  revision: AppEnvironmentPageData_getApp_environments_revision;
  /**
   * Event request stats - Pleae note that environment is automatically set in the filter options
   */
  event_request_stats: AppEnvironmentPageData_getApp_environments_event_request_stats;
  /**
   * The date the `Environment` was created at
   */
  created_at: S8DateTime;
  /**
   * The date the `Environment` was last updated at
   */
  updated_at: S8DateTime;
}

export interface AppEnvironmentPageData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Environments connected to the `App`. Environments are used to create a fixed deployment of a Revision
   */
  environments: AppEnvironmentPageData_getApp_environments[];
}

export interface AppEnvironmentPageData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppEnvironmentPageData_getApp;
}

export interface AppEnvironmentPageDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
