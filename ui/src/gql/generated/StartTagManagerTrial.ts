/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StartTagManagerTrialInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: StartTagManagerTrial
// ====================================================

export interface StartTagManagerTrial_startTagManagerTrial {
  __typename: "TagManagerAccount";
  id: string;
}

export interface StartTagManagerTrial {
  /**
   * @bound=Org
   * Start Tag Manager Trial
   */
  startTagManagerTrial: StartTagManagerTrial_startTagManagerTrial;
}

export interface StartTagManagerTrialVariables {
  startTagManagerTrialInput?: StartTagManagerTrialInput | null;
}
