/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StartDataManagerTrialInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: StartDataManagerTrial
// ====================================================

export interface StartDataManagerTrial_startDataManagerTrial {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
}

export interface StartDataManagerTrial {
  /**
   * @bound=Org
   * Start Data Manager Trial
   */
  startDataManagerTrial: StartDataManagerTrial_startDataManagerTrial;
}

export interface StartDataManagerTrialVariables {
  startDataManagerTrialInput?: StartDataManagerTrialInput | null;
}
