/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IngestQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: IngestSummaryQueryData
// ====================================================

export interface IngestSummaryQueryData_getIngestEndpoint_request_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestSummaryQueryData_getIngestEndpoint_request_stats {
  __typename: "GroupingCountsResponse";
  result: IngestSummaryQueryData_getIngestEndpoint_request_stats_result[];
}

export interface IngestSummaryQueryData_getIngestEndpoint_byte_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestSummaryQueryData_getIngestEndpoint_byte_stats {
  __typename: "GroupingCountsResponse";
  result: IngestSummaryQueryData_getIngestEndpoint_byte_stats_result[];
}

export interface IngestSummaryQueryData_getIngestEndpoint_prev_request_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestSummaryQueryData_getIngestEndpoint_prev_request_stats {
  __typename: "GroupingCountsResponse";
  result: IngestSummaryQueryData_getIngestEndpoint_prev_request_stats_result[];
}

export interface IngestSummaryQueryData_getIngestEndpoint_prev_byte_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestSummaryQueryData_getIngestEndpoint_prev_byte_stats {
  __typename: "GroupingCountsResponse";
  result: IngestSummaryQueryData_getIngestEndpoint_prev_byte_stats_result[];
}

export interface IngestSummaryQueryData_getIngestEndpoint {
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
   * Request stats
   */
  request_stats: IngestSummaryQueryData_getIngestEndpoint_request_stats;
  /**
   * Byte stats
   */
  byte_stats: IngestSummaryQueryData_getIngestEndpoint_byte_stats;
  /**
   * Request stats
   */
  prev_request_stats: IngestSummaryQueryData_getIngestEndpoint_prev_request_stats;
  /**
   * Byte stats
   */
  prev_byte_stats: IngestSummaryQueryData_getIngestEndpoint_prev_byte_stats;
}

export interface IngestSummaryQueryData {
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: IngestSummaryQueryData_getIngestEndpoint;
}

export interface IngestSummaryQueryDataVariables {
  id: string;
  ingestQueryOptions: IngestQueryOptions;
  ingestQueryOptionsPrev: IngestQueryOptions;
}
