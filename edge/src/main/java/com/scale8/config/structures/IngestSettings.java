package com.scale8.config.structures;

import com.google.gson.Gson;
import com.scale8.config.structures.schema.TypeSchema;
import com.scale8.config.structures.storage.BigQueryStreamConfig;
import com.scale8.config.structures.storage.KinesisConfig;
import com.scale8.config.structures.storage.MongoDbConfig;
import com.scale8.config.structures.storage.S3Config;
import org.apache.commons.codec.binary.Hex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

public class IngestSettings {

  private String built;
  private Boolean is_analytics_enabled;
  private Boolean is_commercial;
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
  private KinesisConfig aws_kinesis_config;
  private TypeSchema[] schema;

  public String getBuilt() {
    return built;
  }

  public Boolean getIsAnalyticsEnabled() {
    return is_analytics_enabled;
  }

  public Boolean getIsManaged() {
    return is_managed;
  }

  public Boolean getIsCommercial() {
    return is_commercial;
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

  public S3Config getS3Config() {
    return aws_s3_config;
  }

  public KinesisConfig getKinesisConfig() {
    return aws_kinesis_config;
  }

  public TypeSchema[] getSchema() {
    return schema;
  }

  public HashMap<String, TypeSchema> getSchemaAsMap() {
    return Arrays.stream(schema)
        .collect(
            Collectors.toMap(
                TypeSchema::getCombined, (v) -> v, (prev, next) -> next, HashMap::new));
  }

  public String asHash() throws NoSuchAlgorithmException {
    return Hex.encodeHexString(
        MessageDigest.getInstance("SHA-256")
            .digest((new Gson().toJson(this)).getBytes(StandardCharsets.UTF_8)));
  }
}
