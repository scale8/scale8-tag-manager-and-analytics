package com.scale8;

import javax.inject.Singleton;
import java.util.UUID;

@Singleton
public class Env {

  private final String serverId = UUID.randomUUID().toString();

  private String getOrElse(String name, String orElse) {
    String envVar = System.getenv(name);
    if (envVar == null) {
      return orElse;
    } else {
      return envVar;
    }
  }

  public final String ENV = getOrElse("S8_ENV", "production");

  public final Boolean IS_PROD = ENV.equals("production");

  public final String AWS_ID = getOrElse("AWS_ID", "");

  public final String AWS_SECRET = getOrElse("AWS_SECRET", "");

  public final String AWS_REGION = getOrElse("AWS_REGION", "");

  public final String GOOGLE_CREDENTIALS_FILE = getOrElse("GOOGLE_CREDENTIALS_FILE", "");

  public final String MONGO_CONNECT_STRING =
      getOrElse("MONGO_CONNECT_STRING", "mongodb://127.0.0.1:27017");

  public final String ASSETS_BUCKET = getOrElse("ASSET_BUCKET", "scale8_com_" + ENV + "_assets");

  public final String CONFIG_BUCKET = getOrElse("CONFIGS_BUCKET", "scale8_com_" + ENV + "_configs");

  public final String PROXY_LOCATION = getOrElse("PROXY_ENDPOINT", "http://127.0.0.1:3123/main.js");

  public final String PROXY_FOR = getOrElse("PROXY_FOR", "");

  public final String S8_API_SERVER = getOrElse("S8_API_SERVER", "http://127.0.0.1:8082");

  public final String S8_ROOT_SERVER = getOrElse("S8_ROOT_SERVER", null);

  public final String SERVER_ID = getOrElse("SERVER_ID", serverId);

  public final String MMDB_FILE = getOrElse("MMDB_FILE", "GeoLite2-City.mmdb");
}
