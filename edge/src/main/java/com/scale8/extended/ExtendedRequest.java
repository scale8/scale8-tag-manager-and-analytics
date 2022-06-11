package com.scale8.extended;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.scale8.Env;
import com.scale8.extended.collectors.TupleCollector;
import com.scale8.extended.types.Tuple;
import com.scale8.mmdb.Geo;
import com.scale8.util.HashUtil;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpRequest;
import ua_parser.Parser;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static java.lang.Math.abs;

public class ExtendedRequest {

  final Env env;
  final Geo geo;

  final HttpRequest<String> request;
  final Map<String, String> allParameters;
  final String id;

  private final Cache<String, ua_parser.Client> uaCache =
          Caffeine.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES).maximumSize(1000).build();

  public ExtendedRequest(HttpRequest<String> request, Env env, Geo geo, String id) {
    this.env = env;
    this.geo = geo;
    this.request = request;
    this.allParameters = getParametersAsMap();
    this.id = id;
  }

  public ExtendedRequest(
      HttpRequest<String> request,
      Env env,
      Geo geo,
      String id,
      Map<String, String> extraParameters) {
    this.env = env;
    this.geo = geo;
    this.request = request;
    this.allParameters =
        Stream.of(extraParameters, getParametersAsMap())
            .flatMap(m -> m.entrySet().stream())
            .map(m -> new Tuple<>(m.getKey(), m.getValue()))
            .collect(new TupleCollector<>());
    this.id = id;
  }

  private Map<String, String> getParametersAsMap() {
    return Streamable.iteratorToStream(request.getParameters().iterator())
        .map(p -> new Tuple<>(p.getKey(), p.getValue().isEmpty() ? "" : p.getValue().get(0)))
        .collect(new TupleCollector<>());
  }

  public String getHost() {
    if (env.IS_COMMERICAL) {
      return request.getHeaders().get("Host");
    } else if (id != null) {
      return (env.IS_PROD ? "p" : "d") + id + ".scale8.com";
    } else {
      return request.getServerName();
    }
  }

  public String getId() {
    return id;
  }

  public boolean usingHostRouting() {
    return id == null;
  }

  public String getCountryCode() {
    return geo.getGeoData(getClientAddressAsString()).getCountryCode();
  }

  public String getRegion() {
    return geo.getGeoData(getClientAddressAsString()).getRegion();
  }

  public String getCity() {
    return geo.getGeoData(getClientAddressAsString()).getCity();
  }

  public HttpRequest<String> getRequest() {
    return this.request;
  }

  public Map<String, String> getAllParameters() {
    return allParameters;
  }

  public Optional<JsonObject> getJSONPayload() {
    String data = request.getParameters().get("d");
    if(data != null){
      return Optional.of(new Gson().fromJson(data, JsonObject.class));
    } else if(request.getMethodName().equals("POST")){
      return asJsonObject();
    } else {
      return Optional.empty();
    }
  }

  public Optional<JsonElement> asJsonElement() {
    Optional<String> body = request.getBody();
    if (body.isEmpty()) {
      return Optional.empty();
    } else {
      return Optional.of(new Gson().fromJson(body.get(), JsonElement.class));
    }
  }

  public Optional<JsonObject> asJsonObject() {
    Optional<JsonElement> jsonElement = asJsonElement();
    return jsonElement.isPresent() && jsonElement.get().isJsonObject()
        ? Optional.of(jsonElement.get().getAsJsonObject())
        : Optional.empty();
  }

  public String getRequestingPage() {
    String url = request.getParameters().get("url");
    if (url == null) {
      return request.getHeaders().get(HttpHeaders.REFERER);
    } else {
      return url;
    }
  }

  private Integer getPageDim(String key){
    String pageDim = request.getParameters().get(key);
    if(pageDim == null){
      return null;
    }
    int absValue = abs(Integer.parseInt(pageDim));
    return absValue > 10000? null : absValue;
  }

  public Integer getPageX() {
    return getPageDim("p_x");
  }

  public Integer getPageY() {
    return getPageDim("p_y");
  }

  public String getScreenSize() {
    Integer x = getPageX();
    Integer y = getPageY();
    if(x == null || y == null){
      return null;
    } else {
      return x + "x" + y;
    }
  }

  public String getRevisionPreviewId() {
    return getAllParameters().get("preview");
  }

  public ua_parser.Client getUserAgent() {
    String uaHeader = request.getHeaders().get(HttpHeaders.USER_AGENT);
    String ua = uaHeader == null? "" : uaHeader;
    String uaHash;
    try {
      uaHash = HashUtil.createHash(ua);
    } catch (NoSuchAlgorithmException noSuchAlgorithmException) {
      uaHash = "--";
    }
    ua_parser.Client client = uaCache.getIfPresent(uaHash);
    if(client == null){
      ua_parser.Client freshClient = new Parser().parse(ua);
      uaCache.put(uaHash, freshClient);
      return freshClient;
    } else {
      return client;
    }
  }

  public String getUserAgentAsString() {
    return request.getHeaders().get(HttpHeaders.USER_AGENT);
  }

  public String getRequestingPageReferrer() {
    return request.getParameters().get("referrer");
  }

  public String getEvent() {
    return request.getParameters().get("event");
  }

  public Map<String, String> getRequestingPageUTMTracking() {
    return Streamable.iteratorToStream(request.getParameters().iterator())
        .filter((item) -> item.getKey().startsWith("utm_"))
        .flatMap(
            (item) ->
                item.getValue().isEmpty()
                    ? Stream.empty()
                    : Stream.of(new Tuple<>(item.getKey(), item.getValue().get(0))))
        .collect(new TupleCollector<>());
  }

  public String getClientAddressAsString() {
    HttpHeaders headers = request.getHeaders();
    if (headers.get("X-Forwarded-For") != null) {
      return headers.get("X-Forwarded-For");
    } else if (headers.get("X-ProxyUser-Ip") != null) {
      return headers.get("X-ProxyUser-Ip");
    } else if (headers.get("Remote-Address") != null) {
      return headers.get("Remote-Address");
    }
    return request.getRemoteAddress().toString();
  }

  public String getUserHash() {
    String date =
        LocalDateTime.now(ZoneId.of("UTC")).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    try {
      return HashUtil.createHash(date + getClientAddressAsString() + getUserAgentAsString());
    } catch (NoSuchAlgorithmException noSuchAlgorithmException) {
      noSuchAlgorithmException.printStackTrace();
      return null;
    }
  }

  public int getUserDistributionValue() throws NoSuchAlgorithmException {
    String hash = HashUtil.createHash(getClientAddressAsString() + getUserAgentAsString());
    String hashDigits = hash.replaceAll("\\D+", "");
    return Integer.parseInt(
        hashDigits.length() >= 3 ? hashDigits.substring(hashDigits.length() - 3) : hashDigits);
  }

  public String getServer() {
    if (env.IS_COMMERICAL) {
      return env.IS_PROD? "https://" + getHost() : "https://" + getHost() + ":8443";
    } else {
      String protocol = request.isSecure() ? "https" : "http";
      return (env.S8_EDGE_SERVER == null
              ? protocol + "://" + request.getServerName() + ":" + env.SERVER_PORT
              : env.S8_EDGE_SERVER)
          + "/edge/"
          + id;
    }
  }
}
