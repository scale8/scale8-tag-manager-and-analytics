/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrgAddUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddOrgUserResult
// ====================================================

export interface AddOrgUserResult_addUser {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
}

export interface AddOrgUserResult {
  /**
   * @bound=Org
   * Add a user to an `Org`
   */
  addUser: AddOrgUserResult_addUser;
}

export interface AddOrgUserResultVariables {
  orgAddUserInput: OrgAddUserInput;
}
