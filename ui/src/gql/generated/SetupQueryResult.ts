/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateFirstOrgInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetupQueryResult
// ====================================================

export interface SetupQueryResult_createFirstOrg {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
}

export interface SetupQueryResult {
  /**
   * @bound=Org
   * This endpoint is only enabled to configure the first org.
   */
  createFirstOrg: SetupQueryResult_createFirstOrg;
}

export interface SetupQueryResultVariables {
  createFirstOrgInput: CreateFirstOrgInput;
}
