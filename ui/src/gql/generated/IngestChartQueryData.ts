/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IngestQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: IngestChartQueryData
// ====================================================

export interface IngestChartQueryData_getIngestEndpoint_request_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestChartQueryData_getIngestEndpoint_request_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestChartQueryData_getIngestEndpoint_request_stats_result[];
}

export interface IngestChartQueryData_getIngestEndpoint_byte_stats_result {
  __typename: "GroupingCount";
  key: string;
  count: number;
}

export interface IngestChartQueryData_getIngestEndpoint_byte_stats {
  __typename: "GroupingCountsResponse";
  from: S8DateTime;
  to: S8DateTime;
  result: IngestChartQueryData_getIngestEndpoint_byte_stats_result[];
}

export interface IngestChartQueryData_getIngestEndpoint {
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
  request_stats: IngestChartQueryData_getIngestEndpoint_request_stats;
  /**
   * Byte stats
   */
  byte_stats: IngestChartQueryData_getIngestEndpoint_byte_stats;
}

export interface IngestChartQueryData {
  /**
   * @bound=IngestEndpoint
   */
  getIngestEndpoint: IngestChartQueryData_getIngestEndpoint;
}

export interface IngestChartQueryDataVariables {
  id: string;
  ingestQueryOptions: IngestQueryOptions;
}
