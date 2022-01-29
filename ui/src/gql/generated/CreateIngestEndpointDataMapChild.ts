/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AddChildrenIngestEndpointDataMapsInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateIngestEndpointDataMapChild
// ====================================================

export interface CreateIngestEndpointDataMapChild_addChildrenIngestEndpointDataMaps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
}

export interface CreateIngestEndpointDataMapChild {
  /**
   * @bound=IngestEndpointDataMap
   * Add a new child `IngestEndpointDataMap` to a parent `IngestEndpointDataMap`
   */
  addChildrenIngestEndpointDataMaps: CreateIngestEndpointDataMapChild_addChildrenIngestEndpointDataMaps[];
}

export interface CreateIngestEndpointDataMapChildVariables {
  addChildrenIngestEndpointDataMapsInput: AddChildrenIngestEndpointDataMapsInput;
}
