package com.scale8.backends.storage;

import com.mongodb.client.*;
import com.scale8.Env;
import com.scale8.extended.conditions.RequiresMongoDBStorageCondition;
import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import java.io.FileNotFoundException;
import java.io.IOException;

@Replaces(StorageInterface.class)
@Singleton
@Requires(condition = RequiresMongoDBStorageCondition.class)
public class MongoDb implements StorageInterface {

  private static final Logger LOG = LoggerFactory.getLogger(MongoDb.class);

  final Env env;
  MongoClient mongoClient;

  MongoDb(Env env) {
    this.env = env;
  }

  private MongoClient getClient() {
    if (mongoClient == null) {
      LOG.info("Connecting to MongoDB: " + env.MONGO_CONNECT_STRING);
      mongoClient = MongoClients.create(env.MONGO_CONNECT_STRING);
    }
    return mongoClient;
  }

  private MongoCollection<Document>
  getCollection(String bucket) {
    MongoDatabase database = getClient().getDatabase("s8");
    return database.getCollection(bucket + "_bucket");
  }

  @Override
  public String get(String bucket, String key) throws IOException {
    MongoCollection<Document> collection = getCollection(bucket);
    FindIterable<Document> find = collection.find(new Document("key", key)).limit(1);
    MongoCursor<Document> it = find.iterator();
    if (it.hasNext()) {
      Document doc = it.next();
      return doc.get("blob", String.class);
    } else {
      throw new FileNotFoundException("Unable to find " + key + " in " + bucket);
    }
  }
}
