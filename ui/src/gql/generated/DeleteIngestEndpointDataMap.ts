/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteChildIngestEndpointDataMapInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteIngestEndpointDataMap
// ====================================================

export interface DeleteIngestEndpointDataMap_deleteIngestEndpointDataMap {
  __typename: "ModelDeleteAcknowledgement";
  /**
   * The ID of the model that has been deleted
   */
  id: string;
}

export interface DeleteIngestEndpointDataMap {
  /**
   * @bound=IngestEndpointDataMap
   * Delete an `IngestEndpointDataMap` and all child relationships beneath it
   */
  deleteIngestEndpointDataMap: DeleteIngestEndpointDataMap_deleteIngestEndpointDataMap[];
}

export interface DeleteIngestEndpointDataMapVariables {
  deleteChildIngestEndpointDataMapInput: DeleteChildIngestEndpointDataMapInput;
}
