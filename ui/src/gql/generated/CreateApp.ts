/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateApp
// ====================================================

export interface CreateApp_createApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
}

export interface CreateApp {
  /**
   * @bound=App
   * Create a new `App`.
   */
  createApp: CreateApp_createApp;
}

export interface CreateAppVariables {
  appCreateInput: AppCreateInput;
}
