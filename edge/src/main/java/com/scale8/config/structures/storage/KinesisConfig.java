package com.scale8.config.structures.storage;

public class KinesisConfig {
  private String access_key_id;
  private String secret_access_key;
  private String region;
  private String stream_name;

  public String getAccessKeyId() {
    return this.access_key_id;
  }

  public String getSecretAccessKey() {
    return this.secret_access_key;
  }

  public String getRegion() {
    return this.region;
  }

  public String getStreamName() {
    return this.stream_name;
  }
}
