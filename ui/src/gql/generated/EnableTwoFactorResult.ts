/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TwoFactorAuthEnableInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EnableTwoFactorResult
// ====================================================

export interface EnableTwoFactorResult {
  /**
   * @bound=User
   */
  enableTwoFactorAuth: boolean;
}

export interface EnableTwoFactorResultVariables {
  twoFactorAuthEnableInput: TwoFactorAuthEnableInput;
}
