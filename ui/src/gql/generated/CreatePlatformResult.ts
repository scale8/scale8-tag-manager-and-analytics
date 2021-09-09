/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlatformCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePlatformResult
// ====================================================

export interface CreatePlatformResult_createPlatform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
}

export interface CreatePlatformResult {
  /**
   * @bound=Platform
   * Create a new `Platform`.
   */
  createPlatform: CreatePlatformResult_createPlatform;
}

export interface CreatePlatformResultVariables {
  platformCreateInput: PlatformCreateInput;
}
