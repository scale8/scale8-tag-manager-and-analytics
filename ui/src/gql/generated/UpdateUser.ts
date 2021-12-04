/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { MeUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser {
  /**
   * @bound=User
   * Update currently logged `User`
   */
  updateMe: boolean;
}

export interface UpdateUserVariables {
  meUpdateInput: MeUpdateInput;
}
