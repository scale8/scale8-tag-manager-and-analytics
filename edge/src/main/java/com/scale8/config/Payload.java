package com.scale8.config;

import com.google.common.net.InternetDomainName;
import com.google.gson.*;
import com.google.re2j.Pattern;
import com.scale8.config.structures.schema.TypeSchema;
import com.scale8.config.structures.schema.ValidationSchema;
import com.scale8.extended.ExtendedRequest;
import com.scale8.extended.collectors.JsonObjectCollector;
import com.scale8.extended.Streamable;
import com.scale8.extended.types.Tuple;
import javax.inject.Singleton;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Singleton
public class Payload {

  public JsonObject applyDefaultValues(
      JsonObject payload, HashMap<String, TypeSchema> schema, Replacements replacements) {
    return applyDefaultValues(payload, schema, replacements, null);
  }

  public List<String> validateSchemaAgainstPayload(
      JsonObject payload, HashMap<String, TypeSchema> schema) {
    return validateSchemaAgainstPayload(payload, schema, null);
  }

  private String getTldFromUrl(String url) {
    try {
      return InternetDomainName.from(new URI(url).getHost()).topPrivateDomain().toString();
    } catch (Exception e) {
      return null;
    }
  }

  private JsonElement applyReplacement(JsonElement jsonElement, Replacements replacements) {
    if (jsonElement.isJsonPrimitive()) {
      JsonPrimitive jsonPrimitive = jsonElement.getAsJsonPrimitive();
      if (jsonPrimitive.isString()) {
        ExtendedRequest request = replacements.request;
        Map<String, String> utms = request.getRequestingPageUTMTracking();
        switch (jsonPrimitive.getAsString()) {
          case "%S8_UIID%":
            return new JsonPrimitive(UUID.randomUUID().toString());
          case "%S8_TM_EVENT%":
            return request.getEvent() == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getEvent());
          case "%S8_UTM_SOURCE%":
            return utms.containsKey("utm_source")
                ? new JsonPrimitive(utms.get("utm_source"))
                : JsonNull.INSTANCE;
          case "%S8_UTM_MEDIUM%":
            return utms.containsKey("utm_medium")
                ? new JsonPrimitive(utms.get("utm_medium"))
                : JsonNull.INSTANCE;
          case "%S8_UTM_CAMPAIGN%":
            return utms.containsKey("utm_campaign")
                ? new JsonPrimitive(utms.get("utm_campaign"))
                : JsonNull.INSTANCE;
          case "%S8_UTM_TERM%":
            return utms.containsKey("utm_term")
                ? new JsonPrimitive(utms.get("utm_term"))
                : JsonNull.INSTANCE;
          case "%S8_UTM_CONTENT%":
            return utms.containsKey("utm_content")
                ? new JsonPrimitive(utms.get("utm_content"))
                : JsonNull.INSTANCE;
          case "%S8_TIME_STAMP_UTC%":
            return new JsonPrimitive(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
          case "%S8_DATE_TIME_UTC%":
            return new JsonPrimitive(
                LocalDateTime.now(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_DATE_TIME));
          case "%S8_USER_HASH%":
            String userHash = request.getUserHash();
            return userHash == null ? JsonNull.INSTANCE : new JsonPrimitive(request.getUserHash());
          case "%S8_USER_IP%":
            return new JsonPrimitive(request.getClientAddressAsString());
          case "%S8_USER_AGENT%":
            return request.getUserAgentAsString() == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgentAsString());
          case "%S8_USER_COUNTRY_CODE%":
            String countryCode = request.getCountryCode();
            return countryCode == null ? JsonNull.INSTANCE : new JsonPrimitive(countryCode);
          case "%S8_USER_REGION%":
            String region = request.getRegion();
            return region == null ? JsonNull.INSTANCE : new JsonPrimitive(region);
          case "%S8_USER_CITY%":
            String city = request.getCity();
            return city == null ? JsonNull.INSTANCE : new JsonPrimitive(city);
          case "%S8_RANDOM_INTEGER%":
            return new JsonPrimitive(ThreadLocalRandom.current().nextInt(1, Integer.MAX_VALUE));
          case "%S8_ORG_ID%":
            String orgId = null;
            if (replacements.appSettings != null) {
              orgId = replacements.appSettings.getOrgId();
            } else if (replacements.ingestSettings != null) {
              orgId = replacements.ingestSettings.getOrgId();
            }
            return orgId == null ? JsonNull.INSTANCE : new JsonPrimitive(orgId);
          case "%S8_APP_ID%":
            return replacements.appSettings == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(replacements.appSettings.getAppId());
          case "%S8_INGEST_ENDPOINT_ID%":
            return replacements.ingestSettings == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(replacements.ingestSettings.getIngestEndpointId());
          case "%S8_APP_ENV_ID%":
            return replacements.appSettings == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(replacements.appSettings.getEnvironmentId());
          case "%S8_INGEST_ENV_ID%":
            return replacements.ingestSettings == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(replacements.ingestSettings.getIngestEndpointEnvironmentId());
          case "%S8_APP_REVISION_ID%":
            return replacements.appSettings == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(replacements.appSettings.getRevisionId());
          case "%S8_INGEST_REVISION_ID%":
            return replacements.ingestSettings == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(replacements.ingestSettings.getIngestEndpointRevisionId());
          case "%S8_PAGE_URL%":
            return request.getRequestingPage() == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getRequestingPage());
          case "%S8_PAGE_TLD%":
            if (request.getRequestingPage() == null) {
              return JsonNull.INSTANCE;
            } else {
              String tld = getTldFromUrl(request.getRequestingPage());
              return tld == null ? JsonNull.INSTANCE : new JsonPrimitive(tld);
            }
          case "%S8_PAGE_X%":
            return request.getPageX() == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getPageX());
          case "%S8_PAGE_Y%":
            return request.getPageY() == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getPageY());
          case "%S8_REFERRER_URL%":
            return request.getRequestingPageReferrer() == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getRequestingPageReferrer());
          case "%S8_REFERRER_TLD%":
            if (request.getRequestingPageReferrer() == null) {
              return JsonNull.INSTANCE;
            } else {
              String tld = getTldFromUrl(request.getRequestingPageReferrer());
              return tld == null ? JsonNull.INSTANCE : new JsonPrimitive(tld);
            }
          case "%S8_BROWSER_NAME%":
            return request.getUserAgent().userAgent.family == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().userAgent.family);
          case "%S8_BROWSER_VERSION%":
            return request.getUserAgent().userAgent.major == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().userAgent.major);
          case "%S8_BROWSER_MINOR_VERSION%":
            return request.getUserAgent().userAgent.minor == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().userAgent.minor);
          case "%S8_OS_NAME%":
            return request.getUserAgent().os.family == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().os.family);
          case "%S8_OS_VERSION%":
            return request.getUserAgent().os.major == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().os.major);
          case "%S8_OS_MINOR_VERSION%":
            return request.getUserAgent().os.minor == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().os.minor);
          case "%S8_OS_PATCH_VERSION%":
            return request.getUserAgent().os.patch == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().os.patch);
          case "%S8_DEVICE_NAME%":
            return request.getUserAgent().device.family == null
                ? JsonNull.INSTANCE
                : new JsonPrimitive(request.getUserAgent().device.family);
          case "%S8_DEVICE_MODEL%":
          case "%S8_DEVICE_BRAND%":
            return JsonNull.INSTANCE; // todo, not supported in current library
        }
      }
    }
    return jsonElement;
  }

  private JsonObject applyDefaultValues(
      JsonObject payload,
      HashMap<String, TypeSchema> schema,
      Replacements replacements,
      String parent) {
    return schema.entrySet().stream()
        .filter(
            (item) -> {
              String schemaParent = item.getValue().getParent();
              if (schemaParent == null && parent == null) {
                return true;
              } else {
                return schemaParent != null && schemaParent.equals(parent);
              }
            })
        .flatMap(
            (item) -> {
              TypeSchema typeSchema = item.getValue();
              JsonElement payloadItem = payload.get(typeSchema.getKey());
              if (payloadItem == null) {
                if (typeSchema.getDefault() == null) {
                  return Stream.empty();
                } else {
                  JsonElement replacement = applyReplacement(typeSchema.getDefault(), replacements);
                  return replacement.isJsonNull()
                      ? Stream.empty()
                      : Stream.of(new Tuple<>(typeSchema.getKey(), replacement));
                }
              } else {
                String parentKey =
                    parent == null ? typeSchema.getKey() : parent + "." + typeSchema.getKey();
                if (payloadItem.isJsonObject()) {
                  return Stream.of(
                      new Tuple<String, JsonElement>(
                          typeSchema.getKey(),
                          applyDefaultValues(
                              payloadItem.getAsJsonObject(), schema, replacements, parentKey)));
                } else if (payloadItem.isJsonArray()) {
                  JsonArray jsonArray = new JsonArray();
                  payloadItem
                      .getAsJsonArray()
                      .iterator()
                      .forEachRemaining(
                          (elm) -> {
                            if (elm.isJsonObject()) {
                              jsonArray.add(
                                  applyDefaultValues(
                                      elm.getAsJsonObject(), schema, replacements, parentKey));
                            } else {
                              jsonArray.add(elm);
                            }
                          });
                  return Stream.of(new Tuple<String, JsonElement>(typeSchema.getKey(), jsonArray));
                } else {
                  JsonElement replacement = applyReplacement(payloadItem, replacements);
                  return replacement.isJsonNull()
                      ? Stream.empty()
                      : Stream.of(new Tuple<>(typeSchema.getKey(), replacement));
                }
              }
            })
        .collect(new JsonObjectCollector());
  }

  private List<String> jsValueValidation(JsonElement jsonElement, ValidationSchema[] validations) {
    ArrayList<String> empty = new ArrayList<>();
    if (validations.length > 0) {
      if (jsonElement.isJsonPrimitive()) {
        JsonPrimitive jsonPrimitive = jsonElement.getAsJsonPrimitive();
        if (jsonPrimitive.isString()) {
          int MAX_STRING_SIZE = 32000;
          if (jsonPrimitive.getAsString().getBytes().length > MAX_STRING_SIZE) {
            return List.of("String has exceeded maximum size of " + MAX_STRING_SIZE + " bytes");
          } else {

            return Arrays.stream(validations)
                .map(
                    rule -> {
                      switch (rule.getType()) {
                        case "VALID_REGEX":
                          if (Pattern.compile(rule.getInputValue().getAsString())
                              .matches(jsonPrimitive.getAsString())) {
                            return empty;
                          } else {
                            return List.of(
                                jsonPrimitive.getAsString()
                                    + " does not match regex "
                                    + rule.getInputValue().getAsString());
                          }
                        case "VALID_STRING_MIN_LENGTH":
                          if (jsonPrimitive.getAsString().length()
                              >= rule.getInputValue().getAsInt()) {
                            return empty;
                          } else {
                            return List.of(
                                jsonPrimitive.getAsString()
                                    + " has not reached the minimum accepted length");
                          }
                        case "VALID_STRING_MAX_LENGTH":
                          if (jsonPrimitive.getAsString().length()
                              <= rule.getInputValue().getAsInt()) {
                            return empty;
                          } else {
                            return List.of(
                                jsonPrimitive.getAsString()
                                    + " has exceeded the minimum accepted length");
                          }
                        default:
                          return List.of(
                              rule.getType()
                                  + " is not supported on value "
                                  + jsonPrimitive.getAsString()
                                  + " with type 'string'");
                      }
                    })
                .flatMap(List::stream)
                .collect(Collectors.toList());
          }
        } else if (jsonPrimitive.isNumber()) {
          return Arrays.stream(validations)
              .map(
                  rule -> {
                    if (rule.getType().equals("VALID_NUMBER_MIN")) {
                      if (jsonPrimitive.getAsDouble() >= rule.getInputValue().getAsInt()) {
                        return empty;
                      } else {
                        return List.of(
                            jsonPrimitive.getAsNumber().toString()
                                + " has not exceeded the minimum accepted value");
                      }
                    } else if (rule.getType().equals("VALID_STRING_MAX_LENGTH")) {
                      if (jsonPrimitive.getAsDouble() <= rule.getInputValue().getAsInt()) {
                        return empty;
                      } else {
                        return List.of(
                            jsonPrimitive.getAsNumber().toString()
                                + " has not exceeded the minimum accepted value");
                      }
                    } else {
                      return List.of(
                          rule.getType()
                              + " is not supported on value "
                              + jsonPrimitive.getAsNumber().toString()
                              + " with type 'number'");
                    }
                  })
              .flatMap(List::stream)
              .collect(Collectors.toList());
        } else {
          return List.of("Unsupported primitive validation type");
        }
      } else {
        return List.of("Unsupported validation type");
      }
    } else {
      return empty;
    }
  }

  private List<String> getStandardTypeMismatchReply(TypeSchema item, String point) {
    return List.of(
        "Property '" + item.getKey() + "' on " + point + " should be of type " + item.getType());
  }

  private List<String> checkStringType(TypeSchema item, JsonPrimitive jsonPrimitive, String point) {
    if (jsonPrimitive.isString()) {
      if (item.getType().equals("DATETIME")
          && jsonPrimitive
              .getAsString()
              .matches("^\\d{4}-\\d{2}-\\d{2}[\\sT]{1}\\d{2}:\\d{2}:\\d{2}(\\.(\\d{3,6}))?$")) {
        return List.of();
      } else if (item.getType().equals("STRING")) {
        return jsValueValidation(jsonPrimitive, item.getValidations());
      }
    }
    return getStandardTypeMismatchReply(item, point);
  }

  private List<String> checkNumberType(TypeSchema item, JsonPrimitive jsonPrimitive, String point) {
    if (jsonPrimitive.isNumber()) {
      boolean isInt = jsonPrimitive.getAsFloat() % 1 == 0;
      if (item.getType().equals("TIMESTAMP") && isInt) {
        return List.of();
      } else if ((item.getType().equals("INT") && isInt) || item.getType().equals("FLOAT")) {
        return jsValueValidation(jsonPrimitive, item.getValidations());
      }
    }
    return getStandardTypeMismatchReply(item, point);
  }

  private List<String> checkBooleanType(
      TypeSchema item, JsonPrimitive jsonPrimitive, String point) {
    return jsonPrimitive.isBoolean() && item.getType().equals("BOOLEAN")
        ? List.of()
        : getStandardTypeMismatchReply(item, point);
  }

  private List<String> getOverloadIssues(
      JsonObject payload, HashMap<String, TypeSchema> schema, String parent) {
    // rotate around the payload to capture and extra fields that are not in the schema
    return payload.entrySet().stream()
        .flatMap(
            item -> {
              String combinedKey = parent == null ? item.getKey() : parent + "." + item.getKey();
              if (schema.containsKey(combinedKey)) {
                return Stream.empty();
              } else {
                return Stream.of("'" + combinedKey + "' is not present in schema");
              }
            })
        .collect(Collectors.toList());
  }

  private List<String> validateSchemaAgainstPayload(
      JsonObject payload, HashMap<String, TypeSchema> schema, String parent) {

    // rotate around the schema to validate the payload
    List<String> schemaIssues =
        schema.values().stream()
            .filter(
                typeSchema -> {
                  String schemaParent = typeSchema.getParent();
                  if (schemaParent == null && parent == null) {
                    return true;
                  } else {
                    return schemaParent != null && schemaParent.equals(parent);
                  }
                })
            .map(
                item -> {
                  ArrayList<String> empty = new ArrayList<>();
                  String point = parent == null ? "'root object'" : "'" + parent + "'";
                  JsonElement field = payload.get(item.getKey());
                  String parentKey = parent == null ? item.getKey() : parent + "." + item.getKey();
                  if (field == null || field.isJsonNull()) {
                    return item.getRequired()
                        ? List.of("Property '" + item.getKey() + "' is required on " + point)
                        : empty;
                  } else if (field.isJsonPrimitive()) {
                    JsonPrimitive jsonPrimitive = field.getAsJsonPrimitive();
                    if (jsonPrimitive.isString()) {
                      return checkStringType(item, jsonPrimitive, point);
                    } else if (jsonPrimitive.isNumber()) {
                      return checkNumberType(item, jsonPrimitive, point);
                    } else if (jsonPrimitive.isBoolean()) {
                      return checkBooleanType(item, jsonPrimitive, point);
                    } else {
                      return getStandardTypeMismatchReply(item, point);
                    }
                  } else if (field.isJsonObject()) {
                    return item.getType().equals("OBJECT")
                        ? validateSchemaAgainstPayload(field.getAsJsonObject(), schema, parentKey)
                        : getStandardTypeMismatchReply(item, point);
                  } else if (field.isJsonArray()) {
                    return Streamable.iteratorToStream(field.getAsJsonArray().iterator())
                        .map(
                            jsonElement -> {
                              if (jsonElement.isJsonPrimitive()) {
                                JsonPrimitive jsonPrimitive = jsonElement.getAsJsonPrimitive();
                                if (item.getType().equals("ARRAY_STRING")
                                    && jsonPrimitive.isString()) {
                                  return jsValueValidation(jsonElement, item.getValidations());
                                } else if (jsonPrimitive.isNumber()) {
                                  if ((item.getType().equals("ARRAY_INT")
                                          && jsonPrimitive.getAsDouble() % 1 == 0)
                                      || item.getType().equals("ARRAY_FLOAT")) {
                                    return jsValueValidation(jsonElement, item.getValidations());
                                  }
                                }
                              } else if (jsonElement.isJsonObject()
                                  && item.getType().equals("ARRAY_OBJECT")) {
                                return validateSchemaAgainstPayload(
                                    jsonElement.getAsJsonObject(), schema, parentKey);
                              }
                              return getStandardTypeMismatchReply(item, point);
                            })
                        .flatMap(List::stream)
                        .collect(Collectors.toList());
                  } else {
                    return getStandardTypeMismatchReply(item, point);
                  }
                })
            .flatMap(List::stream)
            .collect(Collectors.toList());

    // combine the overload issues with the schema issues to complete validation report
    return Stream.concat(getOverloadIssues(payload, schema, parent).stream(), schemaIssues.stream())
        .collect(Collectors.toList());
  }
}
