package com.scale8;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.scale8.backends.storage.StorageInterface;
import com.scale8.config.Payload;
import com.scale8.config.Replacements;
import com.scale8.config.structures.IngestSettings;
import com.scale8.extended.ExtendedRequest;
import com.scale8.ingest.Ingestor;
import io.micronaut.cache.annotation.CacheConfig;
import io.micronaut.cache.annotation.Cacheable;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.IOException;
import java.util.List;

@Singleton
@CacheConfig("ingest")
public class IngestEntity {

  @Inject Env env;

  @Inject StorageInterface storage;

  @Inject Ingestor ingestor;

  @Inject Payload payload;

  @Cacheable()
  protected IngestSettings getConfig(String uri) throws IOException {
    return new Gson().fromJson(storage.get(env.CONFIG_BUCKET, uri), IngestSettings.class);
  }

  public IngestSettings getConfigByHost(String host) throws IOException {
    return this.getConfig("ingest-domain/" + host + ".json");
  }

  public IngestSettings getConfigById(String id) throws Exception {
    String name = id.contains(".") ? id : (env.IS_PROD ? "p" : "d") + id + ".scale8.com";
    return this.getConfig("ingest-domain/" + name + ".json");
  }

  protected List<String> offerToIngestor(
      ExtendedRequest extendedRequest, JsonObject jsonObject, IngestSettings ingestSettings) {
    JsonObject data =
        payload.applyDefaultValues(
            jsonObject,
            ingestSettings.getSchemaAsMap(),
            new Replacements(extendedRequest, ingestSettings, null));

    List<String> issues =
        payload.validateSchemaAgainstPayload(data, ingestSettings.getSchemaAsMap());

    if (issues.isEmpty()) {
      ingestor.add(data, ingestSettings);
    }
    return issues;
  }

  public List<String> add(
      ExtendedRequest extendedRequest, IngestSettings ingestSettings, JsonObject jsonObject) {
    return offerToIngestor(extendedRequest, jsonObject, ingestSettings);
  }

  public List<String> add(ExtendedRequest extendedRequest, JsonObject jsonObject)
      throws IOException {
    return offerToIngestor(extendedRequest, jsonObject, getConfigByHost(extendedRequest.getHost()));
  }
}
