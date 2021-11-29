/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: IngestEndpointRevisionPageData
// ====================================================

export interface IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_ingest_endpoint_data_maps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
}

export interface IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_request_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_request_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_request_stats_result[];
}

export interface IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_byte_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_byte_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_byte_stats_result[];
}

export interface IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions {
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
   * The `IngestEndpointDataMaps`s that construct the payload (key => value) configuration for the `IngestEndpointRevision`
   */
  ingest_endpoint_data_maps: IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_ingest_endpoint_data_maps[];
  /**
   * Request stats - Please note that revision is automatically applied in the filter
   */
  request_stats: IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_request_stats;
  /**
   * Byte stats - Please note that revision is automatically applied in the filter
   */
  byte_stats: IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions_byte_stats;
  /**
   * Date the `IngestEndpointRevision` was created
   */
  created_at: S8DateTime;
  /**
   * Date the `IngestEndpointRevision` was last updated
   */
  updated_at: S8DateTime;
}

export interface IngestEndpointRevisionPageData_getIngestEndpoint {
  __typename: "IngestEndpoint";
  /**
   * ID of the `IngestEndpoint`
   */
  id: string;
  /**
   * The `IngestEndpointRevision`s connected to the `IngestEndpoint`
   */
  ingest_endpoint_revisions: IngestEndpointRevisionPageData_getIngestEndpoint_ingest_endpoint_revisions[];
}

export interface IngestEndpointRevisionPageData {
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: IngestEndpointRevisionPageData_getIngestEndpoint;
}

export interface IngestEndpointRevisionPageDataVariables {
  id: string;
  ingestQueryOptions: IngestQueryOptions;
}
