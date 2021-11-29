/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TransferOwnershipInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: OrgTransferOwnershipResult
// ====================================================

export interface OrgTransferOwnershipResult {
  /**
   * @bound=Org
   * Trasfer the `Org` ownership to a target `User`.
   */
  transferOwnership: boolean;
}

export interface OrgTransferOwnershipResultVariables {
  transferOwnershipInput: TransferOwnershipInput;
}
