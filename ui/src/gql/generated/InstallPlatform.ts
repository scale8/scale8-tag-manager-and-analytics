/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppInstallPlatformInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: InstallPlatform
// ====================================================

export interface InstallPlatform_installPlatform {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
}

export interface InstallPlatform {
  /**
   * @bound=App
   * Install a new `Platform`.
   */
  installPlatform: InstallPlatform_installPlatform;
}

export interface InstallPlatformVariables {
  appInstallPlatformInput: AppInstallPlatformInput;
}
