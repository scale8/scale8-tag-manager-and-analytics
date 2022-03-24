package com.scale8;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.scale8.extended.types.Tuple;
import io.micronaut.runtime.server.EmbeddedServer;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.SecretsManagerException;

import javax.inject.Singleton;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Singleton
public class Env {
  public final int SERVER_PORT;

  private HashMap<String, String> config;
  private final String serverId = UUID.randomUUID().toString();

  public Env(EmbeddedServer embeddedServer) {
    SERVER_PORT = embeddedServer.getPort();
  }

  private SecretsManagerClient getSecretsManager() {
    if (!AWS_KEY_STORE_ID.equals("") && !AWS_KEY_STORE_SECRET.equals("")) {
      // if provided, use secrets manager
      return SecretsManagerClient.builder()
          .credentialsProvider(
              StaticCredentialsProvider.create(
                  new AwsCredentials() {
                    @Override
                    public String accessKeyId() {
                      return AWS_KEY_STORE_ID;
                    }

                    @Override
                    public String secretAccessKey() {
                      return AWS_KEY_STORE_SECRET;
                    }
                  }))
          .region(Region.EU_CENTRAL_1)
          .build();
    } else if (IS_COMMERICAL) {
      return SecretsManagerClient.builder().region(Region.EU_CENTRAL_1).build();
    } else {
      return null;
    }
  }

  private HashMap<String, String> getConfig() {
    if (config == null) {
      SecretsManagerClient secretsManagerClient = getSecretsManager();
      if (secretsManagerClient == null) {
        config = new HashMap<>();
      } else {
        try {
          String secret =
              secretsManagerClient
                  .getSecretValue(
                      GetSecretValueRequest.builder()
                          .secretId("SCALE8_" + ENV.toUpperCase())
                          .build())
                  .secretString();
          config =
              new Gson()
                  .fromJson(secret, JsonObject.class).entrySet().stream()
                      .flatMap(
                          entry -> {
                            JsonElement value = entry.getValue();
                            if (value.isJsonPrimitive()) {
                              JsonPrimitive jsonPrimitive = (JsonPrimitive) value;
                              return Stream.of(
                                  new Tuple<>(entry.getKey(), jsonPrimitive.getAsString()));
                            } else {
                              return Stream.empty();
                            }
                          })
                      .collect(
                          Collectors.toMap(
                              (k) -> k.x, (v) -> v.y, (prev, next) -> next, HashMap::new));
          secretsManagerClient.close();
        } catch (SecretsManagerException e) {
          config = new HashMap<>();
        }
      }
    }
    return config;
  }

  private String getOrElseFromEnvOnly(String name, String orElse) {
    String envVar = System.getenv(name);
    return envVar == null ? orElse : envVar;
  }

  private String getOrElse(String name, String orElse) {
    String envVar = System.getenv(name);
    if (envVar == null) {
      HashMap<String, String> conf = getConfig();
      String val = conf.get(name);
      return val == null ? orElse : val;
    } else {
      return envVar;
    }
  }

  public final Boolean IS_COMMERICAL =
      getOrElseFromEnvOnly("SERVER_MODE", "SELF_HOSTED").equals("COMMERCIAL");

  public final String ENV = getOrElseFromEnvOnly("S8_ENV", "development");

  public final Boolean IS_PROD = ENV.equals("production");

  public final String AWS_KEY_STORE_ID = getOrElseFromEnvOnly("AWS_KEY_STORE_ID", "");

  public final String AWS_KEY_STORE_SECRET = getOrElseFromEnvOnly("AWS_KEY_STORE_SECRET", "");

  public final String STORAGE_BACKEND = getOrElse("STORAGE_BACKEND", "mongodb");

  public final String AWS_ID = getOrElse("AWS_ID", "");

  public final int INGEST_WINDOW_SIZE_SECONDS = Integer.parseInt(getOrElse("INGEST_WINDOW_SIZE_SECONDS", "10"));

  public final int INGEST_TIMEOUT_JOBS_SECONDS = Integer.parseInt(getOrElse("INGEST_TIMEOUT_JOBS_SECONDS", "60"));

  public final int INGEST_MAX_THREADS = Integer.parseInt(getOrElse("INGEST_MAX_THREADS", "10"));

  public final String AWS_SECRET = getOrElse("AWS_SECRET", "");

  public final String AWS_REGION = getOrElse("AWS_REGION", "");

  public final String GOOGLE_CREDENTIALS = getOrElse("GC_JSON", "");

  public final String GOOGLE_CREDENTIALS_FILE = getOrElse("GC_KEY_FILE", "");

  public final String MONGO_CONNECT_STRING =
      getOrElse("MONGO_CONNECT_STRING", "mongodb://127.0.0.1:27017");

  public final String DEFAULT_DATABASE = getOrElse("DEFAULT_DATABASE", "s8");

  public final String ASSETS_BUCKET = getOrElse("ASSET_BUCKET", "scale8_com_" + ENV + "_assets");

  public final String CONFIG_BUCKET = getOrElse("CONFIGS_BUCKET", "scale8_com_" + ENV + "_configs");

  public final String PROXY_LOCATION = getOrElse("PROXY_LOCATION", "http://127.0.0.1:3123/main.js");

  public final String PROXY_FOR = getOrElse("PROXY_FOR", "");

  private String getApiServerDefault() {
    if(IS_COMMERICAL){
      if(IS_PROD){
        return "https://api.scale8.com";
      } else {
        return "https://api-dev.scale8.com:8443";
      }
    } else {
      return "http://127.0.0.1:8082";
    }
  }

  public final String S8_API_SERVER = getOrElse("S8_API_SERVER", getApiServerDefault());

  private String getUiServerDefault() {
    if(IS_COMMERICAL){
      if(IS_PROD){
        return "https://ui.scale8.com";
      } else {
        return "https://ui-dev.scale8.com:8443";
      }
    } else {
      return "http://127.0.0.1:3000";
    }
  }

  public final String S8_UI_SERVER = getOrElse("S8_UI_SERVER", getUiServerDefault());

  public final String S8_EDGE_SERVER = getOrElse("S8_EDGE_SERVER", null);

  public final String SERVER_ID = getOrElse("SERVER_ID", serverId);

  public final String MMDB_FILE = getOrElse("MMDB_FILE", "GeoLite2-City.mmdb");
}
