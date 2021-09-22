package com.scale8.ingest.storage;

import com.google.gson.JsonObject;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.scale8.config.structures.IngestSettings;
import com.scale8.config.structures.schema.TypeSchema;
import com.scale8.config.structures.storage.MongoDbConfig;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.bson.Document;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

import static org.mockito.Mockito.*;

@MicronautTest
class PushToMongoDbTest {
    @Inject
    PushToMongoDb sut;

    private static IngestSettings ingestSettings;
    private static MongoCollection<Document> mongoCollection;

    @BeforeAll
    static void setUp() {
        ingestSettings = mock(IngestSettings.class);
        MongoDbConfig mongoDbConfig = mock(MongoDbConfig.class);
        when(ingestSettings.getIsManaged()).thenReturn(false);
        when(ingestSettings.getMongoDbConfig()).thenReturn(mongoDbConfig);
        when(ingestSettings.getIngestEndpointRevisionId()).thenReturn("xxx");
        when(mongoDbConfig.getDatabaseName()).thenReturn("s8");
        when(mongoDbConfig.getConnectionString()).thenReturn("mongodb://localhost");
        //noinspection ResultOfMethodCallIgnored
        mockStatic(MongoClients.class);
        MongoClient mongoClient = mock(MongoClient.class);
        when(MongoClients.create(anyString())).thenReturn(mongoClient);
        MongoDatabase mongoDatabase = mock(MongoDatabase.class);
        when(mongoClient.getDatabase(anyString())).thenReturn(mongoDatabase);
        //noinspection unchecked
        mongoCollection = (MongoCollection<Document>) mock(MongoCollection.class);
        when(mongoDatabase.getCollection(anyString())).thenReturn(mongoCollection);
    }

    @Test
    void testPush() throws NoSuchAlgorithmException {
        JsonObject payload = new JsonObject();
        payload.addProperty("a", "test1");
        HashMap<String, TypeSchema> typeSchemaMap = new HashMap<>();
        TypeSchema typeSchema = mock(TypeSchema.class);
        when(typeSchema.getParent()).thenReturn(null);
        when(typeSchema.getKey()).thenReturn("a");
        when(typeSchema.getCombined()).thenReturn("a");
        when(typeSchema.getType()).thenReturn("STRING");
        when(typeSchema.getDefault()).thenReturn(null);
        when(typeSchema.getRequired()).thenReturn(true);
        when(typeSchema.getRepeated()).thenReturn(false);
        when(typeSchema.getValidations()).thenReturn(null);
        typeSchemaMap.put("a", typeSchema);

        when(ingestSettings.getSchemaAsMap()).thenReturn(typeSchemaMap);
        ConcurrentLinkedQueue<JsonObject> q = new ConcurrentLinkedQueue<>();
        q.add(payload);
        sut.push(ingestSettings, q);
        List<Document> documents = new ArrayList<>();
        documents.add(new Document(Map.of("a", "test1", "___ingest_revision_id", "xxx")));

        verify(mongoCollection).insertMany(documents);
    }
}
