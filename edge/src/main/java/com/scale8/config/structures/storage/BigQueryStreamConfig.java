package com.scale8.config.structures.storage;

import com.google.gson.JsonObject;

public class BigQueryStreamConfig {
  private JsonObject service_account_json;
  private String data_set_name;
  private Boolean require_partition_filter_in_queries;

  public JsonObject getServiceAccountJson() {
    return service_account_json;
  }

  public String getDataSetName() {
    return data_set_name;
  }

  public Boolean getRequirePartitionFilterInQueries() {
    return require_partition_filter_in_queries;
  }
}
