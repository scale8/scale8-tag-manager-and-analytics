/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlatformRevisionPageData
// ====================================================

export interface PlatformRevisionPageData_getPlatform_platform_revisions {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The name of the `PlatformRevision`
   */
  name: string;
  /**
   * Whether or not the `PlatformRevision` has been locked or not. When locked no future changes can be made to the `PlatformRevision` or any of its connected entities
   */
  locked: boolean;
  /**
   * Whether or not the `PlatformRevision` has been published. Once published the `PlatformRevision` can be installed by publishers in to their `App`s.
   */
  is_published: boolean;
  /**
   * The date the `PlatformRevision` was created
   */
  created_at: S8DateTime;
  /**
   * The date the `PlatformRevision` was last updated
   */
  updated_at: S8DateTime;
}

export interface PlatformRevisionPageData_getPlatform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `PlatformRevision`s the are linked to this `Platform`. Please note that if the `Platform` has been made public and `PlatformRevision` has been published, it will be avalible to ***any*** Scale8 Tag Manager User to install in their `App`
   */
  platform_revisions: PlatformRevisionPageData_getPlatform_platform_revisions[];
}

export interface PlatformRevisionPageData {
  /**
   * @bound=Platform
   * Method will return a `Platform` instance from its ID.
   * 
   * !> Note that if the `Platform` has been made public, it will be accessible to ***any*** Scale8 Tag Manager User.
   */
  getPlatform: PlatformRevisionPageData_getPlatform;
}

export interface PlatformRevisionPageDataVariables {
  id: string;
}
