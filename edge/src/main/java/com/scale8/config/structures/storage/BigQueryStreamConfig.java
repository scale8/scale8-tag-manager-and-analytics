package com.scale8.config.structures.storage;

public class BigQueryStreamConfig {
  private String service_account_json;
  private String data_set_name;
  private Boolean require_partition_filter_in_queries;

  public String getServiceAccountJson() {
    return service_account_json;
  }

  public String getDataSetName() {
    return data_set_name;
  }

  public Boolean getRequirePartitionFilterInQueries() {
    return require_partition_filter_in_queries;
  }
}
