package com.scale8.config.structures.storage;

public class MongoDbConfig {
  private String connection_string;
  private String database_name;

  public String getConnectionString() {
    return connection_string;
  }

  public String getDatabaseName() {
    return database_name;
  }
}
