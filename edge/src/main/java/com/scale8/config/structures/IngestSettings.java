package com.scale8.config.structures;

import com.scale8.config.structures.schema.TypeSchema;
import com.scale8.config.structures.storage.BigQueryStreamConfig;
import com.scale8.config.structures.storage.MongoDbConfig;
import com.scale8.config.structures.storage.S3Config;

import java.util.*;
import java.util.stream.Collectors;

public class IngestSettings {

  private String built;
  private Boolean is_managed;
  private String usage_ingest_env_id;
  private String org_id;
  private String data_manager_account_id;
  private String ingest_endpoint_id;
  private String ingest_endpoint_environment_id;
  private String ingest_endpoint_revision_id;
  private String storage_provider;
  private BigQueryStreamConfig gc_bigquery_stream_config;
  private MongoDbConfig mongodb_config;
  private S3Config aws_s3_config;
  private TypeSchema[] schema;

  public String getBuilt() {
    return built;
  }

  public Boolean getIsManaged() {
    return is_managed;
  }

  public String getUsageIngestEnvId() {
    return usage_ingest_env_id;
  }

  public String getOrgId() {
    return org_id;
  }

  public String getDataManagerAccountId() {
    return data_manager_account_id;
  }

  public String getIngestEndpointId() {
    return ingest_endpoint_id;
  }

  public String getIngestEndpointEnvironmentId() {
    return ingest_endpoint_environment_id;
  }

  public String getIngestEndpointRevisionId() {
    return ingest_endpoint_revision_id;
  }

  public String getStorageProvider() {
    return storage_provider;
  }

  public BigQueryStreamConfig getBigQueryStreamConfig() {
    return gc_bigquery_stream_config;
  }

  public MongoDbConfig getMongoDbConfig() {
    return mongodb_config;
  }

  public S3Config getS3Config(){ return aws_s3_config; }

  public TypeSchema[] getSchema() {
    return schema;
  }

  public HashMap<String, TypeSchema> getSchemaAsMap() {
    return Arrays.stream(schema)
        .collect(
            Collectors.toMap(
                TypeSchema::getCombined, (v) -> v, (prev, next) -> next, HashMap::new));
  }
}
