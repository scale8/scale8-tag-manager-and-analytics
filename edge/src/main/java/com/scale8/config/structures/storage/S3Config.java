package com.scale8.config.structures.storage;

public class S3Config {
  private String access_key_id;
  private String secret_access_key;
  private String region;
  private String bucket_name;
  private String path_prefix;

  public String getAccessKeyId() {
    return this.access_key_id;
  }

  public String getSecretAccessKey() {
    return this.secret_access_key;
  }

  public String getRegion() {
    return this.region;
  }

  public String getBucketName() {
    return this.bucket_name;
  }

  public String getPathPrefix() {
    return this.path_prefix;
  }
}
