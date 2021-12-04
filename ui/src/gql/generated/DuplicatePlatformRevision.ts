/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DuplicatePlatformRevisionInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DuplicatePlatformRevision
// ====================================================

export interface DuplicatePlatformRevision_duplicatePlatformRevision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
}

export interface DuplicatePlatformRevision {
  /**
   * @bound=PlatformRevision
   * Duplicate platform revision will clone any linked items and return a new platform revision
   */
  duplicatePlatformRevision: DuplicatePlatformRevision_duplicatePlatformRevision;
}

export interface DuplicatePlatformRevisionVariables {
  duplicatePlatformRevisionInput: DuplicatePlatformRevisionInput;
}
