/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestQueryOptions, StorageProvider } from "./globalTypes";

// ====================================================
// GraphQL query operation: IngestEndpointEnvironmentPageData
// ====================================================

export interface IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_ingest_endpoint_revision {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * Name of the `IngestEndpointRevision`
   */
  name: string;
}

export interface IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_request_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_request_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_request_stats_result[];
}

export interface IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_byte_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_byte_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_byte_stats_result[];
}

export interface IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments {
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
   * `IngestEndpointEnvironment`'s install domain used to push data to
   */
  install_domain: string;
  /**
   * A hint of the credentials currently in use by the `IngestEndpointEnvironment`.
   * For security reasons we don't enable to full retrival of this information via
   * the API. It does not persist in our database or servers and remains in our vault.
   */
  config_hint: string;
  /**
   * The storage provider used by the `IngestEndpointEnvironment` to store ingested data
   */
  storage_provider: StorageProvider;
  /**
   * The `IngestEndpointRevision` currently bound to the `IngestEndpointEnvironment`
   */
  ingest_endpoint_revision: IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_ingest_endpoint_revision;
  /**
   * Request stats - Please note that environment is automatically applied in the filter
   */
  request_stats: IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_request_stats;
  /**
   * Byte stats - Please note that environment is automatically applied in the filter
   */
  byte_stats: IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments_byte_stats;
  /**
   * Date the `IngestEndpointEnvironment` was created
   */
  created_at: S8DateTime;
  /**
   * Date the `IngestEndpointEnvironment` last updated
   */
  updated_at: S8DateTime;
}

export interface IngestEndpointEnvironmentPageData_getIngestEndpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * The `IngestEndpointEnvironment`s owned by the `IngestEndpoint`
   */
  ingest_endpoint_environments: IngestEndpointEnvironmentPageData_getIngestEndpoint_ingest_endpoint_environments[];
}

export interface IngestEndpointEnvironmentPageData {
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: IngestEndpointEnvironmentPageData_getIngestEndpoint;
}

export interface IngestEndpointEnvironmentPageDataVariables {
  id: string;
  ingestQueryOptions: IngestQueryOptions;
}
