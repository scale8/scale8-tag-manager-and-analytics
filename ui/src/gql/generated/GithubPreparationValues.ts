/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PrepareGitHubLinkInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: GithubPreparationValues
// ====================================================

export interface GithubPreparationValues_prepareGitHubLink {
  __typename: "User";
  /**
   * `User` ID
   */
  id: string;
}

export interface GithubPreparationValues {
  /**
   * @bound=User
   * Prepare currently logged `User` be linked with GitHub
   */
  prepareGitHubLink: GithubPreparationValues_prepareGitHubLink;
}

export interface GithubPreparationValuesVariables {
  prepareGitHubLinkInput: PrepareGitHubLinkInput;
}
