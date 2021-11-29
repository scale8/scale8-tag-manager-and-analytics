/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PlatformType } from "./globalTypes";

// ====================================================
// GraphQL query operation: PlatformPageData
// ====================================================

export interface PlatformPageData_getTagManagerAccount_platforms_platform_revisions {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
}

export interface PlatformPageData_getTagManagerAccount_platforms {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
  /**
   * `PlatformRevision`s the are linked to this `Platform`. Please note that if the
   * `Platform` has been made public and `PlatformRevision` has been published, it
   * will be avalible to ***any*** Scale8 Tag Manager User to install in their `App`
   */
  platform_revisions: PlatformPageData_getTagManagerAccount_platforms_platform_revisions[];
  /**
   * If the platform has been published, this flag will be true.
   */
  is_public: boolean;
  /**
   * Platform type
   */
  type: PlatformType;
  /**
   * Date the `Platform` was created at
   */
  created_at: S8DateTime;
  /**
   * Date the `Platform` was last updated at
   */
  updated_at: S8DateTime;
}

export interface PlatformPageData_getTagManagerAccount {
  __typename: "TagManagerAccount";
  id: string;
  platforms: PlatformPageData_getTagManagerAccount_platforms[];
}

export interface PlatformPageData {
  /**
   * @bound=TagManagerAccount
   */
  getTagManagerAccount: PlatformPageData_getTagManagerAccount;
}

export interface PlatformPageDataVariables {
  id: string;
}
