package com.scale8;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.scale8.backends.storage.StorageInterface;
import com.scale8.config.Payload;
import com.scale8.config.Replacements;
import com.scale8.config.structures.AppSettings;
import com.scale8.config.structures.IngestSettings;
import com.scale8.extended.ExtendedRequest;
import com.scale8.extended.collectors.JsonObjectCollector;
import com.scale8.extended.types.Tuple;
import com.scale8.ingest.Ingestor;
import io.micronaut.cache.annotation.CacheConfig;
import io.micronaut.cache.annotation.Cacheable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.micronaut.http.HttpHeaders.ACCEPT;
import static io.micronaut.http.MediaType.APPLICATION_JSON;

@Singleton
@CacheConfig("app")
public class AppEntity {

  private final String PUBLIC_PATH = "http://127.0.0.1:3123";

  private static final Logger LOG = LoggerFactory.getLogger(AppEntity.class);

  @Inject Env env;

  @Inject StorageInterface storage;

  @Inject IngestEntity ingestEntity;

  @Inject Payload payload;

  @Inject Ingestor ingestor;

  public AppSettings getConfig(ExtendedRequest request) throws Exception {
    return new Gson().fromJson(getRawConfig(request), AppSettings.class);
  }

  @Cacheable()
  protected String getRawConfig(ExtendedRequest request) throws IOException, InterruptedException {
    String previewId = request.getRevisionPreviewId();
    if (previewId == null) {
      // fetch the config from GCS against the incoming host...
      return storage.get(env.CONFIG_BUCKET, "tag-domain/" + request.getHost() + ".json");
    } else {
      return HttpClient.newHttpClient()
          .send(
              HttpRequest.newBuilder(
                      URI.create(env.S8_API_SERVER + "/preview-revision/" + previewId))
                  .header(ACCEPT, APPLICATION_JSON)
                  .build(),
              HttpResponse.BodyHandlers.ofString())
          .body();
    }
  }

  private String doJsProxyRequest(String url) throws IOException, InterruptedException {
    return HttpClient.newHttpClient()
        .send(
            HttpRequest.newBuilder(URI.create(url))
                .header(ACCEPT, "application/javascript")
                .build(),
            HttpResponse.BodyHandlers.ofString())
        .body();
  }

  private JsonObject getClientConfig(ExtendedRequest request) throws Exception {
    String countryCode = request.getCountryCode();
    String revisionPreviewId = request.getRevisionPreviewId();
    JsonObject jsonObject = new Gson().fromJson(getRawConfig(request), JsonObject.class);
    jsonObject.add("server", new JsonPrimitive(request.getServer()));
    jsonObject.add("serverMode", new JsonPrimitive(env.ENV));
    jsonObject.add("distributionValue", new JsonPrimitive(request.getUserDistributionValue()));
    jsonObject.add("countryCode", new JsonPrimitive(countryCode == null ? "--" : countryCode));
    jsonObject.add(
        "uiServer",
        new JsonPrimitive(env.S8_ROOT_SERVER == null ? "https://scale8.com" : env.S8_ROOT_SERVER));
    if (revisionPreviewId != null) {
      jsonObject.add("preview", new JsonPrimitive(revisionPreviewId));
    }
    return jsonObject;
  }

  private String publicPath(ExtendedRequest extendedRequest, String platformId, String revisionId) {
    String base =
        extendedRequest.usingHostRouting()
            ? extendedRequest.getHost()
            : extendedRequest.getServer();
    if (revisionId != null) {
      return base + "/p/" + platformId + "/" + revisionId + "/";
    } else {
      String previewId = extendedRequest.getRevisionPreviewId();
      return previewId != null
          ? base + "/p/" + platformId + "/" + previewId + "/"
          : base + "/d/" + platformId + "/";
    }
  }

  public String fetchJSAsset(ExtendedRequest request, String platformId, String asset)
      throws Exception {
    AppSettings appSettings = getConfig(request);
    String ngp = request.getRequest().getParameters().get("ngp");
    if (appSettings.getCorePlatformId().equals(platformId) && ngp != null) {
      return doJsProxyRequest("http://" + ngp + ".ngrok.io/" + asset);
    } else {
      return storage.get(
          env.ASSETS_BUCKET, appSettings.getAllAssetsMap().get(platformId + "-" + asset));
    }
  }

  public String getPrimaryJsAsset(ExtendedRequest request, String platformId) throws Exception {
    AppSettings appSettings = getConfig(request);
    String primaryAssetUri = appSettings.getPrimaryAssetMap().get(platformId);
    if (primaryAssetUri == null) {
      throw new FileNotFoundException(
          "Unable to find primary asset in map for platform " + platformId);
    } else {
      String js =
          env.PROXY_FOR.equals(platformId)
              ? doJsProxyRequest(env.PROXY_LOCATION)
              : storage.get(env.ASSETS_BUCKET, primaryAssetUri);

      return js.replace(
              PUBLIC_PATH, publicPath(request, platformId, request.getRevisionPreviewId()))
          .replace("S8_REPLACE_PLATFORM_ID", platformId);
    }
  }

  private void track(ExtendedRequest request, JsonObject data) throws Exception {
    AppSettings appSettings = getConfig(request);
    IngestSettings ingestSettings = ingestEntity.getConfigById(appSettings.getUsageIngestEnvId());

    JsonObject trackingPayload =
        payload.applyDefaultValues(
            data, ingestSettings.getSchemaAsMap(), new Replacements(request, null, appSettings));

    List<String> issues =
        payload.validateSchemaAgainstPayload(trackingPayload, ingestSettings.getSchemaAsMap());

    if (issues.isEmpty()) {
      // go ahead and log this...
      ingestor.add(trackingPayload, ingestSettings);
    } else {
      // we don't want to throw, if there is a problem here output to logs as it is our fault.
      issues.forEach(issue -> LOG.warn("Tracking issue: " + issue));
    }
  }

  public void trackEvent(ExtendedRequest request) throws Exception {
    Map<String, String> params = request.getAllParameters();
    HashMap<String, JsonPrimitive> dataMap = new HashMap<>();
    dataMap.put(
        "event", params.get("event") == null ? null : new JsonPrimitive(params.get("event")));
    dataMap.put(
        "event_group",
        params.get("event_group") == null ? null : new JsonPrimitive(params.get("event_group")));
    dataMap.put(
        "error_file",
        params.get("error_file") == null ? null : new JsonPrimitive(params.get("error_file")));
    dataMap.put(
        "error_message",
        params.get("error_message") == null
            ? null
            : new JsonPrimitive(params.get("error_message")));
    dataMap.put(
        "error_column",
        params.get("error_column") == null
            ? null
            : new JsonPrimitive(Integer.parseInt(params.get("error_column"))));
    dataMap.put(
        "error_row",
        params.get("error_row") == null
            ? null
            : new JsonPrimitive(Integer.parseInt(params.get("error_row"))));

    track(
        request,
        dataMap.entrySet().stream()
            .filter(entry -> entry.getValue() != null)
            .map(e -> new Tuple<String, JsonElement>(e.getKey(), e.getValue()))
            .collect(new JsonObjectCollector()));
  }

  public String getCoreJs(ExtendedRequest request) throws Exception {
    AppSettings appSettings = getConfig(request);

    if (appSettings.getIsAnalyticsEnabled()) {
      track(request, new JsonObject());
    }

    boolean isProxyMode =
        env.PROXY_FOR.equals(appSettings.getCorePlatformId()) || env.PROXY_FOR.equals("core");

    String js =
        isProxyMode
            ? doJsProxyRequest(env.PROXY_LOCATION)
            : getPrimaryJsAsset(request, appSettings.getCorePlatformId());

    String cdnPath = publicPath(request, appSettings.getCorePlatformId(), null);

    return js.replace("S8_CONFIG_REPLACE", new Gson().toJson(getClientConfig(request)))
        .replace(PUBLIC_PATH, cdnPath);
  }
}
