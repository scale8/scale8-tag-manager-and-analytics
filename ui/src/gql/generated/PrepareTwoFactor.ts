/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PrepareTwoFactor
// ====================================================

export interface PrepareTwoFactor_me {
  __typename: "User";
  /**
   * `User`'s email address
   */
  email: string;
}

export interface PrepareTwoFactor {
  /**
   * @bound=User
   * Generate and get a new two factor secret
   */
  prepareTwoFactor: string;
  /**
   * @bound=User
   * Get a the session user
   */
  me: PrepareTwoFactor_me;
}
