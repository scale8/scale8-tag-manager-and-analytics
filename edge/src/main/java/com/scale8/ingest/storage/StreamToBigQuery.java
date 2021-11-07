package com.scale8.ingest.storage;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.bigquery.*;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.scale8.Env;
import com.scale8.config.structures.IngestSettings;
import com.scale8.config.structures.schema.TypeSchema;
import com.scale8.extended.types.Tuple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Singleton;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Singleton
public class StreamToBigQuery extends StorageProvider {

  private static final Logger LOG = LoggerFactory.getLogger(StreamToBigQuery.class);

  private final HashMap<String, BigQuery> bigQueryInstances = new HashMap<>();

  final Env env;

  StreamToBigQuery(Env env) {
    this.env = env;
  }

  @Override
  public void push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q) {
    try {
      BigQuery bigQuery = getBigQueryInstance(ingestSettings);
      TableId tableId = getTableId(ingestSettings);
      buildMissingTable(bigQuery, ingestSettings);

      while (!q.isEmpty()) {
        List<InsertAllRequest.RowToInsert> rows =
            getNextBatch(q).stream()
                .map(
                    jsonObject ->
                        InsertAllRequest.RowToInsert.of(
                            UUID.randomUUID().toString(), convertJsonObject(jsonObject)))
                .collect(Collectors.toList());

        InsertAllResponse response =
            bigQuery.insertAll(InsertAllRequest.newBuilder(tableId).setRows(rows).build());
        if (response.hasErrors()) {
          LOG.error("BigQuery: " + response.toString());
        }
      }

    } catch (Exception e) {
      LOG.error("BigQuery: " + e.getMessage());
    }
  }

  private BigQuery getBigQueryInstance(IngestSettings ingestSettings)
      throws IOException, NoSuchAlgorithmException {
    String instanceKey = ingestSettings.getIngestEndpointEnvironmentId() + ingestSettings.asHash();
    BigQuery instance = this.bigQueryInstances.get(instanceKey);

    if (instance == null) {
      if (ingestSettings.getIsCommercial() && ingestSettings.getIsManaged()) {
        ServiceAccountCredentials credentials;
        if (!env.GOOGLE_CREDENTIALS.equals("")) {
          credentials =
              ServiceAccountCredentials.fromStream(
                  new ByteArrayInputStream(
                      env.GOOGLE_CREDENTIALS.trim().getBytes(StandardCharsets.UTF_8)));
        } else {
          credentials =
              ServiceAccountCredentials.fromStream(
                  new FileInputStream(env.GOOGLE_CREDENTIALS_FILE));
        }
        instance = BigQueryOptions.newBuilder().setCredentials(credentials).build().getService();
      } else {
        instance =
            BigQueryOptions.newBuilder()
                .setCredentials(
                    GoogleCredentials.fromStream(
                        new ByteArrayInputStream(
                            new Gson()
                                .toJson(
                                    ingestSettings
                                        .getBigQueryStreamConfig()
                                        .getServiceAccountJson())
                                .getBytes(StandardCharsets.UTF_8))))
                .build()
                .getService();
      }
      this.bigQueryInstances.put(instanceKey, instance);
    }
    return instance;
  }

  private TableId getTableId(IngestSettings ingestSettings) {
    return TableId.of(
        ingestSettings.getBigQueryStreamConfig().getDataSetName(),
        "s8_"
            + ingestSettings.getIngestEndpointEnvironmentId()
            + "_"
            + ingestSettings.getIngestEndpointRevisionId());
  }

  private void buildMissingTable(BigQuery bigQuery, IngestSettings ingestSettings) {
    TableId tableId = getTableId(ingestSettings);
    if (bigQuery.getTable(tableId) == null) {
      FieldList fields = generateBigQueryFields(ingestSettings.getSchemaAsMap());
      Schema schema = Schema.of(fields);
      TableInfo tableInfo =
          TableInfo.newBuilder(
                  tableId,
                  StandardTableDefinition.newBuilder()
                      .setSchema(schema)
                      .setTimePartitioning(TimePartitioning.of(TimePartitioning.Type.HOUR))
                      .build())
              .setRequirePartitionFilter(
                  ingestSettings.getBigQueryStreamConfig().getRequirePartitionFilterInQueries())
              .build();
      bigQuery.create(tableInfo);
    }
  }

  private Optional<Object> convertJsonElement(JsonElement jsonElement) {
    if (jsonElement.isJsonObject()) {
      return Optional.of(convertJsonObject(jsonElement.getAsJsonObject()));
    } else if (jsonElement.isJsonPrimitive()) {
      JsonPrimitive primitive = jsonElement.getAsJsonPrimitive();
      if (primitive.isString()) {
        return Optional.of(primitive.getAsString());
      } else if (primitive.isNumber()) {
        return Optional.of(primitive.getAsNumber());
      } else if (primitive.isBoolean()) {
        return Optional.of(primitive.getAsBoolean());
      }
    } else if (jsonElement.isJsonArray()) {
      Iterator<JsonElement> it = jsonElement.getAsJsonArray().iterator();
      ArrayList<Object> objects = new ArrayList<>();
      while (it.hasNext()) {
        objects.add(convertJsonElement(it.next()));
      }
      return Optional.of(objects);
    }
    return Optional.empty();
  }

  private Map<String, Object> convertJsonObject(JsonObject jsonObject) {
    return jsonObject.entrySet().stream()
        .flatMap(
            entry -> {
              Optional<Object> elm = convertJsonElement(entry.getValue());
              return elm.isEmpty()
                  ? Stream.empty()
                  : Stream.of(new Tuple<>(entry.getKey(), elm.get()));
            })
        .collect(Collectors.toMap((k) -> k.x, (v) -> v.y));
  }

  private Field generateBigQueryField(TypeSchema typeSchema, FieldList children) throws Exception {
    Field.Mode mode = typeSchema.getRequired() ? Field.Mode.REQUIRED : Field.Mode.NULLABLE;
    String key = typeSchema.getKey();
    switch (typeSchema.getType()) {
      case "DATETIME":
        return Field.of(key, StandardSQLTypeName.DATETIME).toBuilder().setMode(mode).build();
      case "TIMESTAMP":
        return Field.of(key, StandardSQLTypeName.TIMESTAMP).toBuilder().setMode(mode).build();
      case "STRING":
        return Field.of(key, StandardSQLTypeName.STRING).toBuilder().setMode(mode).build();
      case "BOOLEAN":
        return Field.of(key, StandardSQLTypeName.BOOL).toBuilder().setMode(mode).build();
      case "INT":
        return Field.of(key, StandardSQLTypeName.INT64).toBuilder().setMode(mode).build();
      case "FLOAT":
        return Field.of(key, StandardSQLTypeName.FLOAT64).toBuilder().setMode(mode).build();
      case "OBJECT":
        return Field.of(key, StandardSQLTypeName.STRUCT, children).toBuilder()
            .setMode(mode)
            .build();
      case "ARRAY_STRING":
        return Field.of(key, StandardSQLTypeName.STRING).toBuilder()
            .setMode(Field.Mode.REPEATED)
            .build();
      case "ARRAY_INT":
        return Field.of(key, StandardSQLTypeName.INT64).toBuilder()
            .setMode(Field.Mode.REPEATED)
            .build();
      case "ARRAY_FLOAT":
        return Field.of(key, StandardSQLTypeName.FLOAT64).toBuilder()
            .setMode(Field.Mode.REPEATED)
            .build();
      case "ARRAY_OBJECT":
        return Field.of(key, StandardSQLTypeName.STRUCT, children).toBuilder()
            .setMode(Field.Mode.REPEATED)
            .build();
    }
    throw new Exception("Unable to convert " + typeSchema.getType() + " to BigQuery field");
  }

  private FieldList generateBigQueryFields(HashMap<String, TypeSchema> schema) {
    return generateBigQueryFields(schema, null);
  }

  private FieldList generateBigQueryFields(HashMap<String, TypeSchema> schema, String parent) {
    return FieldList.of(
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
                typeSchema -> {
                  String key = typeSchema.getKey();
                  String parentKey = parent == null ? key : parent + "." + key;
                  switch (typeSchema.getType()) {
                    case "OBJECT":
                    case "ARRAY_OBJECT":
                      try {
                        return generateBigQueryField(
                            typeSchema, generateBigQueryFields(schema, parentKey));
                      } catch (Exception e) {
                        e.printStackTrace();
                      }
                    default:
                      try {
                        return generateBigQueryField(typeSchema, FieldList.of());
                      } catch (Exception e) {
                        e.printStackTrace();
                      }
                  }
                  return null;
                })
            .collect(Collectors.toList()));
  }
}
