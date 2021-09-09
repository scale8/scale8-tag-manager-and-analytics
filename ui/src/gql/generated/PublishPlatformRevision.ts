/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PublishPlatformRevisionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: PublishPlatformRevision
// ====================================================

export interface PublishPlatformRevision {
  /**
   * @bound=PlatformRevision
   * This will attempt to finalise and publish the `PlatformRevision` and make it avalible for publishers to use, implement and upgrade to.
   */
  publishPlatformRevision: boolean;
}

export interface PublishPlatformRevisionVariables {
  publishPlatformRevisionInput: PublishPlatformRevisionInput;
}
