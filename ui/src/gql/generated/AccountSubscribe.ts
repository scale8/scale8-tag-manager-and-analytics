/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccountSubscribeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AccountSubscribe
// ====================================================

export interface AccountSubscribe {
  /**
   * @bound=Org
   * Subscribe To TagManager
   * 
   * This will generate a new link that the user can follow to checkout if
   * it has no subscription yet, it will return null otherwise.
   */
  accountSubscribe: string | null;
}

export interface AccountSubscribeVariables {
  accountSubscribeInput?: AccountSubscribeInput | null;
}
