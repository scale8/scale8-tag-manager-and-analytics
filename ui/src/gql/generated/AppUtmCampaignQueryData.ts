/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppUtmCampaignQueryData
// ====================================================

export interface AppUtmCampaignQueryData_getApp_utm_campaign_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppUtmCampaignQueryData_getApp_utm_campaign_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppUtmCampaignQueryData_getApp_utm_campaign_stats_result[];
}

export interface AppUtmCampaignQueryData_getApp {
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
   * UTM Campaigns
   */
  utm_campaign_stats: AppUtmCampaignQueryData_getApp_utm_campaign_stats;
}

export interface AppUtmCampaignQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppUtmCampaignQueryData_getApp;
}

export interface AppUtmCampaignQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
