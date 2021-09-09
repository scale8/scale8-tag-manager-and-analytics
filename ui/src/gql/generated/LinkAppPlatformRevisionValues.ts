/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppPlatformRevisionLinkInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: LinkAppPlatformRevisionValues
// ====================================================

export interface LinkAppPlatformRevisionValues_linkPlatformRevision {
  __typename: "PlatformRevisionMergeIssue";
  /**
   * ID of the model
   */
  id: string;
  /**
   * Type of model
   */
  entity: string;
  /**
   * Name of the model
   */
  name: string;
}

export interface LinkAppPlatformRevisionValues {
  /**
   * @bound=AppPlatformRevision
   * Link an app and platform together via their corresponding revisions.
   */
  linkPlatformRevision: LinkAppPlatformRevisionValues_linkPlatformRevision[];
}

export interface LinkAppPlatformRevisionValuesVariables {
  appPlatformRevisionLinkInput: AppPlatformRevisionLinkInput;
}
