/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StorageProvider } from "./globalTypes";

// ====================================================
// GraphQL query operation: UpdateIngestEndpointGetData
// ====================================================

export interface UpdateIngestEndpointGetData_getIngestEndpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * Name of the `IngestEndpoint`
   */
  name: string;
  /**
   * Whether the analytics on the `IngestEndpoint` is enabled
   */
  analytics_enabled: boolean;
  /**
   * The storage provider used by the `IngestEndpoint` to track data
   */
  storage_provider: StorageProvider;
}

export interface UpdateIngestEndpointGetData {
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: UpdateIngestEndpointGetData_getIngestEndpoint;
}

export interface UpdateIngestEndpointGetDataVariables {
  id: string;
}
