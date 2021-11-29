/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StorageProvider } from "./globalTypes";

// ====================================================
// GraphQL query operation: UpdateIngestEndpointEnvironmentGetData
// ====================================================

export interface UpdateIngestEndpointEnvironmentGetData_getIngestEndpointEnvironment_ingest_endpoint_revision {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
}

export interface UpdateIngestEndpointEnvironmentGetData_getIngestEndpointEnvironment {
  __typename: "IngestEndpointEnvironment";
  /**
   * ID of the `IngestEndpointEnvironment`
   */
  id: string;
  /**
   * Name of the `IngestEndpointEnvironment`
   */
  name: string;
  /**
   * A custom domain name associated with this `IngestEndpointEnvironment`
   */
  custom_domain: string | null;
  /**
   * The storage provider used by the `IngestEndpointEnvironment` to store ingested data
   */
  storage_provider: StorageProvider;
  /**
   * The `IngestEndpointRevision` currently bound to the `IngestEndpointEnvironment`
   */
  ingest_endpoint_revision: UpdateIngestEndpointEnvironmentGetData_getIngestEndpointEnvironment_ingest_endpoint_revision;
}

export interface UpdateIngestEndpointEnvironmentGetData_getIngestEndpoint_ingest_endpoint_revisions {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * Name of the `IngestEndpointRevision`
   */
  name: string;
  /**
   * The `IngestEndpointRevision` has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Date the `IngestEndpointRevision` was created
   */
  created_at: S8DateTime;
  /**
   * Date the `IngestEndpointRevision` was last updated
   */
  updated_at: S8DateTime;
}

export interface UpdateIngestEndpointEnvironmentGetData_getIngestEndpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * The `IngestEndpointRevision`s connected to the `IngestEndpoint`
   */
  ingest_endpoint_revisions: UpdateIngestEndpointEnvironmentGetData_getIngestEndpoint_ingest_endpoint_revisions[];
}

export interface UpdateIngestEndpointEnvironmentGetData {
  /**
   * @bound=IngestEndpointEnvironment
   * Get an `IngestEndpointEnvironment` model from `IngestEndpointEnvironment` ID
   */
  getIngestEndpointEnvironment: UpdateIngestEndpointEnvironmentGetData_getIngestEndpointEnvironment;
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: UpdateIngestEndpointEnvironmentGetData_getIngestEndpoint;
}

export interface UpdateIngestEndpointEnvironmentGetDataVariables {
  id: string;
  ingestEndpointId: string;
}
