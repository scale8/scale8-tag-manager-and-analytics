package com.scale8;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.scale8.asset.Loader;
import com.scale8.backends.storage.StorageInterface;
import com.scale8.extended.ExtendedRequest;
import com.scale8.mmdb.Geo;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Inject;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static io.micronaut.http.MediaType.APPLICATION_JSON;

@Controller()
public class RootController {

  protected final String APPLICATION_JAVASCRIPT = "application/javascript";
  protected final String OK_JSON = "{\"o\":\"k\"}";

  private static final Logger LOG = LoggerFactory.getLogger(RootController.class);

  @Inject Loader loader;

  @Inject AppEntity appEntity;

  @Inject IngestEntity ingestEntity;

  @Inject Env env;

  @Inject Geo geo;

  @Inject
  StorageInterface storage;

  private ExtendedRequest createExtendedRequest(
      HttpRequest<String> request, String id, Map<String, String> extraParameters) {
    return new ExtendedRequest(
        request, env, geo, id, extraParameters == null ? Map.of() : extraParameters);
  }

  private String handleIngestRequest(HttpRequest<String> request, String id) throws Exception {
    ExtendedRequest extendedRequest = createExtendedRequest(request, id, null);
    Optional<JsonObject> payload = extendedRequest.getJSONPayload();
    List<String> issues =
        payload.isPresent()
            ? ingestEntity.add(extendedRequest, payload.get())
            : List.of("Failed to find payload");
    return issues.isEmpty() ? OK_JSON : new Gson().toJson(issues);
  }

  @Get(produces = APPLICATION_JSON)
  public String ingestGetRequest(HttpRequest<String> request) throws Exception {
    return this.handleIngestRequest(request, null);
  }

  @Get(uri = "/edge/{id}", produces = APPLICATION_JSON)
  public String ingestGetRequest(HttpRequest<String> request, @PathVariable String id)
      throws Exception {
    return this.handleIngestRequest(request, id);
  }

  @Post(produces = APPLICATION_JSON)
  public String ingestPostRequest(HttpRequest<String> request) throws Exception {
    return this.handleIngestRequest(request, null);
  }

  @Post(uri = "/edge/{id}", produces = APPLICATION_JSON)
  public String ingestPostRequest(HttpRequest<String> request, @PathVariable String id)
      throws Exception {
    return this.handleIngestRequest(request, id);
  }

  private HttpResponse<String> handleAnalyticsLoader(HttpRequest<String> request, String id)
      throws IOException {
    String opts = request.getParameters().get("opts");
    return HttpResponse.ok(
        loader
            .getResourceAsString("analytics.js")
            .replace("$spa", opts != null && opts.contains("spa") ? "!0" : "!1")
            .replace("$hash", opts != null && opts.contains("hash") ? "!0" : "!1")
            .replace("$getSvr", createExtendedRequest(request, id, null).getServer()));
  }

  @Get(uri = "/analytics.js", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> analyticsLoader(HttpRequest<String> request) throws IOException {
    return this.handleAnalyticsLoader(request, null);
  }

  @Get(uri = "/edge/{id}/analytics.js", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> analyticsLoader(HttpRequest<String> request, @PathVariable String id)
      throws IOException {
    return this.handleAnalyticsLoader(request, id);
  }

  private HttpResponse<String> handleTmLoader(HttpRequest<String> request, String id)
      throws IOException {
    return HttpResponse.ok(
        loader
            .getResourceAsString("tm.js")
            .replace("$getSvr", createExtendedRequest(request, id, null).getServer()));
  }

  @Get(uri = "/tm.js", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> tmLoader(HttpRequest<String> request) throws IOException {
    return handleTmLoader(request, null);
  }

  @Get(uri = "/edge/{id}/tm.js", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> tmLoader(HttpRequest<String> request, @PathVariable String id)
      throws IOException {
    return handleTmLoader(request, id);
  }

  private HttpResponse<String> handleTmCore(HttpRequest<String> request, String id)
      throws Exception {
    return HttpResponse.ok(appEntity.getCoreJs(createExtendedRequest(request, id, null)));
  }

  @Get(uri = "/tm-core.js", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> tmCore(HttpRequest<String> request) throws Exception {
    return handleTmCore(request, null);
  }

  @Get(uri = "/edge/{id}/tm-core.js", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> tmCore(HttpRequest<String> request, @PathVariable String id)
      throws Exception {
    return handleTmCore(request, id);
  }

  private String handleTrackEvent(HttpRequest<String> request, String id, String event)
      throws Exception {
    appEntity.trackEvent(createExtendedRequest(request, id, Map.of("event", event)));
    return OK_JSON;
  }

  @Get(uri = "/e/{event}", produces = APPLICATION_JAVASCRIPT)
  public String trackEvent(HttpRequest<String> request, @PathVariable String event)
      throws Exception {
    return handleTrackEvent(request, null, event);
  }

  @Get(uri = "/edge/{id}/e/{event}", produces = APPLICATION_JAVASCRIPT)
  public String trackEvent(
      HttpRequest<String> request, @PathVariable String id, @PathVariable String event)
      throws Exception {
    return handleTrackEvent(request, id, event);
  }

  private HttpResponse<String> handlePrimaryJsAsset(
      HttpRequest<String> request, String id, String platformId, String revisionId)
      throws Exception {
    return HttpResponse.ok(
        appEntity.getPrimaryJsAsset(
            createExtendedRequest(
                request, id, revisionId == null ? null : Map.of("preview", revisionId)),
            platformId));
  }

  @Get(uri = "/d/{platformId}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> primaryJsAsset(
      HttpRequest<String> request, @PathVariable String platformId) throws Exception {
    return handlePrimaryJsAsset(request, null, platformId, null);
  }

  @Get(uri = "/edge/{id}/d/{platformId}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> primaryJsAsset(
      HttpRequest<String> request, @PathVariable String id, @PathVariable String platformId)
      throws Exception {
    return handlePrimaryJsAsset(request, id, platformId, null);
  }

  @Get(uri = "/p/{platformId}/{revisionId}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> primaryJsAssetPreview(
      HttpRequest<String> request, @PathVariable String platformId, @PathVariable String revisionId)
      throws Exception {
    return handlePrimaryJsAsset(request, null, platformId, revisionId);
  }

  @Get(uri = "/edge/{id}/p/{platformId}/{revisionId}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> primaryJsAssetPreview(
      HttpRequest<String> request,
      @PathVariable String platformId,
      @PathVariable String id,
      @PathVariable String revisionId)
      throws Exception {
    return handlePrimaryJsAsset(request, id, platformId, revisionId);
  }

  private HttpResponse<String> handleJsAsset(
      HttpRequest<String> request, String id, String platformId, String revisionId, String asset)
      throws Exception {
    return HttpResponse.ok(
        appEntity.fetchJSAsset(
            createExtendedRequest(
                request, id, revisionId == null ? null : Map.of("preview", revisionId)),
            platformId,
            asset));
  }

  @Get(uri = "/d/{platformId}/{asset}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> jsAsset(
      HttpRequest<String> request, @PathVariable String platformId, @PathVariable String asset)
      throws Exception {
    return handleJsAsset(request, null, platformId, null, asset);
  }

  @Get(uri = "/edge/{id}/d/{platformId}/{asset}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> jsAsset(
      HttpRequest<String> request,
      @PathVariable String id,
      @PathVariable String platformId,
      @PathVariable String asset)
      throws Exception {
    return handleJsAsset(request, id, platformId, null, asset);
  }

  @Get(uri = "/p/{platformId}/{revisionId}/{asset}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> jsAssetPreview(
      HttpRequest<String> request,
      @PathVariable String platformId,
      @PathVariable String revisionId,
      @PathVariable String asset)
      throws Exception {
    return handleJsAsset(request, null, platformId, revisionId, asset);
  }

  @Get(uri = "/edge/{id}/p/{platformId}/{revisionId}/{asset}", produces = APPLICATION_JAVASCRIPT)
  public HttpResponse<String> jsAssetPreview(
      HttpRequest<String> request,
      @PathVariable String id,
      @PathVariable String platformId,
      @PathVariable String revisionId,
      @PathVariable String asset)
      throws Exception {
    return handleJsAsset(request, id, platformId, revisionId, asset);
  }
}
