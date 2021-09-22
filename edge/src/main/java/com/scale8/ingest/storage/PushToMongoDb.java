package com.scale8.ingest.storage;

import com.google.gson.*;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.scale8.Env;
import com.scale8.config.structures.IngestSettings;
import com.scale8.config.structures.schema.TypeSchema;
import com.scale8.extended.Streamable;
import com.scale8.extended.collectors.TupleCollector;
import com.scale8.extended.types.Tuple;
import org.bson.BsonDateTime;
import org.bson.Document;
import javax.inject.Singleton;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Singleton
public class PushToMongoDb extends StorageProvider {

  final Env env;

  PushToMongoDb(Env env) {
    this.env = env;
  }

  private final HashMap<String, MongoClient> mongoInstances = new HashMap<>();

  private MongoClient getMongoDbInstance(IngestSettings ingestSettings)
      throws NoSuchAlgorithmException {
    String instanceKey = ingestSettings.getIngestEndpointEnvironmentId() + ingestSettings.asHash();
    MongoClient instance = mongoInstances.get(instanceKey);
    if (instance == null) {
      instance =
          ingestSettings.getMongoDbConfig().useApiMongoServer()
              ? MongoClients.create(env.MONGO_CONNECT_STRING)
              : MongoClients.create(ingestSettings.getMongoDbConfig().getConnectionString());
      mongoInstances.put(instanceKey, instance);
    }
    return instance;
  }

  private Document createFromJsonObject(IngestSettings ingestSettings, JsonObject jsonObject) {
    // we need to apply types as mongodb doesn't handle simple conversions on insert
    Document document = new Document(applyTypes(jsonObject, ingestSettings.getSchemaAsMap(), null));
    document.append("___ingest_revision_id", ingestSettings.getIngestEndpointRevisionId());
    return document;
  }

  @Override
  public void push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q)
      throws NoSuchAlgorithmException {
    while (!q.isEmpty()) {
      List<Document> documents =
          getNextBatch(q).stream()
              .map(d -> createFromJsonObject(ingestSettings, d))
              .collect(Collectors.toList());
      documents.forEach(document -> System.out.println(document.toString()));
      getCollection(ingestSettings).insertMany(documents);
    }
  }

  private MongoCollection<Document> getCollection(IngestSettings ingestSettings)
      throws NoSuchAlgorithmException {
    MongoClient instance = getMongoDbInstance(ingestSettings);
    MongoDatabase database =
        ingestSettings.getMongoDbConfig().useApiMongoServer()
            ? instance.getDatabase(env.DEFAULT_DATABASE)
            : instance.getDatabase(ingestSettings.getMongoDbConfig().getDatabaseName());
    return database.getCollection("s8_" + ingestSettings.getIngestEndpointEnvironmentId());
  }

  private Map<String, Object> applyTypes(
      JsonObject jsonObject, HashMap<String, TypeSchema> schema, String parent) {

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
              JsonElement payloadItem = jsonObject.get(typeSchema.getKey());
              if (payloadItem != null) {
                String parentKey =
                    parent == null ? typeSchema.getKey() : parent + "." + typeSchema.getKey();
                if (payloadItem.isJsonObject()) {
                  return Stream.of(
                      new Tuple<String, Object>(
                          typeSchema.getKey(),
                          applyTypes(payloadItem.getAsJsonObject(), schema, parentKey)));
                } else if (payloadItem.isJsonArray()) {
                  return Stream.of(
                      new Tuple<String, Object>(
                          typeSchema.getKey(),
                          Streamable.iteratorToStream(payloadItem.getAsJsonArray().iterator())
                              .map(
                                  elm ->
                                      applyTypes(payloadItem.getAsJsonObject(), schema, parentKey))
                              .collect(Collectors.toList())));
                } else if (payloadItem.isJsonPrimitive()) {
                  JsonPrimitive primitive = payloadItem.getAsJsonPrimitive();
                  if (primitive.isString() && typeSchema.getType().equals("DATETIME")) {
                    try {
                      Date dt =
                          new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                              .parse(primitive.getAsString());
                      return Stream.of(
                          new Tuple<String, Object>(
                              typeSchema.getKey(), new BsonDateTime(dt.getTime())));
                    } catch (ParseException e) {
                      return Stream.empty();
                    }
                  } else if (primitive.isString()) {
                    return Stream.of(
                        new Tuple<String, Object>(typeSchema.getKey(), primitive.getAsString()));
                  } else if (primitive.isNumber()) {
                    return Stream.of(
                        new Tuple<String, Object>(typeSchema.getKey(), primitive.getAsNumber()));
                  } else if (primitive.isBoolean()) {
                    return Stream.of(
                        new Tuple<String, Object>(typeSchema.getKey(), primitive.getAsBoolean()));
                  }
                }
              }
              return Stream.empty();
            })
        .collect(new TupleCollector<>());
  }
}
