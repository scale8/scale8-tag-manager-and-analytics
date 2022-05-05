/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: IngestEndpointPageData
// ====================================================

export interface IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_ingest_endpoint_revisions {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
}

export interface IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_ingest_endpoint_environments {
  __typename: "IngestEndpointEnvironment";
  /**
   * ID of the `IngestEndpointEnvironment`
   */
  id: string;
}

export interface IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_request_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_request_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_request_stats_result[];
}

export interface IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_byte_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_byte_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_byte_stats_result[];
}

export interface IngestEndpointPageData_getDataManagerAccount_ingest_endpoints {
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
   * The `IngestEndpointRevision`s connected to the `IngestEndpoint`
   */
  ingest_endpoint_revisions: IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_ingest_endpoint_revisions[];
  /**
   * The `IngestEndpointEnvironment`s owned by the `IngestEndpoint`
   */
  ingest_endpoint_environments: IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_ingest_endpoint_environments[];
  /**
   * Request stats
   */
  request_stats: IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_request_stats;
  /**
   * Byte stats
   */
  byte_stats: IngestEndpointPageData_getDataManagerAccount_ingest_endpoints_byte_stats;
  /**
   * Date the `IngestEndpoint` was created
   */
  created_at: S8DateTime;
  /**
   * Date the `IngestEndpoint` was last updated
   */
  updated_at: S8DateTime;
}

export interface IngestEndpointPageData_getDataManagerAccount {
  __typename: "DataManagerAccount";
  /**
   * `DataManagerAccount` ID
   */
  id: string;
  /**
   * A list of `IngestEndpoint`s linked to the `DataManagerAccount`
   */
  ingest_endpoints: IngestEndpointPageData_getDataManagerAccount_ingest_endpoints[];
}

export interface IngestEndpointPageData {
  /**
   * @bound=DataManagerAccount
   * Returns a `DataManagerAccount` instance provided a valid ID is given and the user has sufficient privileges to view it.
   */
  getDataManagerAccount: IngestEndpointPageData_getDataManagerAccount;
}

export interface IngestEndpointPageDataVariables {
  id: string;
  ingestQueryOptions: IngestQueryOptions;
}
