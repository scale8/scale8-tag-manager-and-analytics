/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GlobalActionGroupDistributionLinkInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: LinkGlobalActionResult
// ====================================================

export interface LinkGlobalActionResult {
  /**
   * @bound=Rule
   * Link a global `ActionGroupDistribution`'s to a `Rule`
   */
  linkGlobalActionGroupDistribution: boolean;
}

export interface LinkGlobalActionResultVariables {
  globalActionGroupDistributionLinkInput: GlobalActionGroupDistributionLinkInput;
}
