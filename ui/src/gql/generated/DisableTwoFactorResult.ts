/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TwoFactorAuthDisableInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DisableTwoFactorResult
// ====================================================

export interface DisableTwoFactorResult {
  /**
   * @bound=User
   */
  disableTwoFactorAuth: boolean;
}

export interface DisableTwoFactorResultVariables {
  twoFactorAuthDisableInput: TwoFactorAuthDisableInput;
}
