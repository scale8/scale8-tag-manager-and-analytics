/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccountUnsubscribeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AccountUnsubscribe
// ====================================================

export interface AccountUnsubscribe {
  /**
   * @bound=Org
   * Cancel subscription
   */
  accountUnsubscribe: boolean;
}

export interface AccountUnsubscribeVariables {
  accountUnsubscribeInput?: AccountUnsubscribeInput | null;
}
