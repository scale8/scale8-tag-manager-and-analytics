/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GlobalActionGroupDistributionUnlinkInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UnLinkGlobalActionResult
// ====================================================

export interface UnLinkGlobalActionResult {
  /**
   * @bound=Rule
   * Link a global `ActionGroupDistribution`'s to a `Rule`
   */
  unlinkGlobalActionGroupDistribution: boolean;
}

export interface UnLinkGlobalActionResultVariables {
  globalActionGroupDistributionUnlinkInput: GlobalActionGroupDistributionUnlinkInput;
}
