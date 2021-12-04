/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppPlatformRevisionUnlinkInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: unLinkAppPlatformRevisionValues
// ====================================================

export interface unLinkAppPlatformRevisionValues_unlinkPlatformRevision {
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

export interface unLinkAppPlatformRevisionValues {
  /**
   * @bound=AppPlatformRevision
   * Delete an `AppPlatformRevision` and its children.
   */
  unlinkPlatformRevision: unLinkAppPlatformRevisionValues_unlinkPlatformRevision[];
}

export interface unLinkAppPlatformRevisionValuesVariables {
  appPlatformRevisionUnlinkInput: AppPlatformRevisionUnlinkInput;
}
