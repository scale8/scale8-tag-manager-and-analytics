/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IngestEndpointAddIngestEndpointDataMapsInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateIngestEndpointDataMap
// ====================================================

export interface CreateIngestEndpointDataMap_addIngestEndpointDataMaps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
}

export interface CreateIngestEndpointDataMap {
  /**
   * @bound=IngestEndpointRevision
   * Add one or more `IngestEndpointDataMap`s to the `IngestEndpointRevision`.
   */
  addIngestEndpointDataMaps: CreateIngestEndpointDataMap_addIngestEndpointDataMaps[];
}

export interface CreateIngestEndpointDataMapVariables {
  ingestEndpointAddIngestEndpointDataMapsInput?: IngestEndpointAddIngestEndpointDataMapsInput | null;
}
