package com.scale8.config.structures;

import java.util.Map;

public class AppSettings {

  private String built;
  private String usageIngestEnvId;
  private String orgId;
  private String appId;
  private String envId;
  private String revisionId;
  private String corePlatformId;
  private String corePlatformRevisionId;
  private Map<String, String> primaryAssetMap;
  private Map<String, String> allAssetsMap;

  public String getBuilt() {
    return built;
  }

  public String getUsageIngestEnvId() {
    return usageIngestEnvId;
  }

  public String getOrgId() {
    return orgId;
  }

  public String getAppId() {
    return appId;
  }

  public String getEnvironmentId() {
    return envId;
  }

  public String getRevisionId() {
    return revisionId;
  }

  public String getCorePlatformId() {
    return corePlatformId;
  }

  public String getCorePlatformRevisionId() {
    return corePlatformRevisionId;
  }

  public Map<String, String> getPrimaryAssetMap() {
    return primaryAssetMap;
  }

  public Map<String, String> getAllAssetsMap() {
    return allAssetsMap;
  }
}
