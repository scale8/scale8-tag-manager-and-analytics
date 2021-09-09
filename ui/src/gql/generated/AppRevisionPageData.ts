/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppRevisionPageData
// ====================================================

export interface AppRevisionPageData_getApp_revisions_tags {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
}

export interface AppRevisionPageData_getApp_revisions_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
}

export interface AppRevisionPageData_getApp_revisions_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: AppRevisionPageData_getApp_revisions_app_platform_revisions_platform_revision;
}

export interface AppRevisionPageData_getApp_revisions_event_request_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppRevisionPageData_getApp_revisions_event_request_stats {
  __typename: "AppGroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: AppRevisionPageData_getApp_revisions_event_request_stats_result[];
}

export interface AppRevisionPageData_getApp_revisions {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
  /**
   * Get all the tags linked to this revision
   */
  tags: AppRevisionPageData_getApp_revisions_tags[];
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: AppRevisionPageData_getApp_revisions_app_platform_revisions[];
  /**
   * Event request stats - Please note that revision is automatically set in the filter options
   */
  event_request_stats: AppRevisionPageData_getApp_revisions_event_request_stats;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Revision Creation Time
   */
  created_at: S8DateTime;
  /**
   * Revision Last Update Time
   */
  updated_at: S8DateTime;
}

export interface AppRevisionPageData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: AppRevisionPageData_getApp_revisions[];
}

export interface AppRevisionPageData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppRevisionPageData_getApp;
}

export interface AppRevisionPageDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
