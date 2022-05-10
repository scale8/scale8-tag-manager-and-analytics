package com.scale8.ingest.storage;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.bigquery.*;
import com.google.gson.JsonObject;
import com.scale8.config.structures.IngestSettings;
import com.scale8.config.structures.storage.BigQueryStreamConfig;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentLinkedQueue;

import static org.mockito.Mockito.*;

@MicronautTest
class PushToBigQueryTest {
    @Inject
    PushToBigQuery sut;

    private static IngestSettings ingestSettings;

    private static BigQuery bigQuery;

    @BeforeAll
    static void setUp() throws IOException {
        bigQuery = mock(BigQuery.class);
        ingestSettings = mock(IngestSettings.class);
        BigQueryStreamConfig bigQueryStreamConfig = mock(BigQueryStreamConfig.class);
        when(ingestSettings.getIsManaged()).thenReturn(false);
        when(ingestSettings.getIngestEndpointEnvironmentId()).thenReturn("eid");
        when(ingestSettings.getIngestEndpointRevisionId()).thenReturn("rid");
        when(ingestSettings.getBigQueryStreamConfig()).thenReturn(bigQueryStreamConfig);
        when(bigQueryStreamConfig.getServiceAccountJson()).thenReturn(new JsonObject());
        when(bigQueryStreamConfig.getDataSetName()).thenReturn("ds");

        BigQueryOptions.Builder builder = mock(BigQueryOptions.Builder.class);
        BigQueryOptions options = mock(BigQueryOptions.class);


        //noinspection ResultOfMethodCallIgnored
        mockStatic(BigQueryOptions.class);
        when(BigQueryOptions.newBuilder()).thenReturn(builder);
        when(builder.setCredentials(any(Credentials.class))).thenReturn(builder);
        when(builder.setCredentials(any(Credentials.class))).thenReturn(builder);
        when(builder.build()).thenReturn(options);
        when(options.getService()).thenReturn(bigQuery);
        GoogleCredentials googleCredentials = mock(GoogleCredentials.class);
        //noinspection ResultOfMethodCallIgnored
        mockStatic(GoogleCredentials.class);
        when(GoogleCredentials.fromStream(any(InputStream.class))).thenReturn(googleCredentials);

        //noinspection ResultOfMethodCallIgnored
        mockStatic(UUID.class);
        UUID uuid = mock(UUID.class);
        when(uuid.toString()).thenReturn("uuid");
        when(UUID.randomUUID()).thenReturn(uuid);
    }

    @Test
    void testPush() {
        JsonObject payload = new JsonObject();
        payload.addProperty("a", "test");
        ConcurrentLinkedQueue<JsonObject> q = new ConcurrentLinkedQueue<>();
        q.add(payload);
        sut.push(ingestSettings, q);
        Schema schema = Schema.of(new ArrayList<>());
        TableInfo tableInfo =
                TableInfo.newBuilder(
                                TableId.of("ds", "s8_eid_rid"),
                                StandardTableDefinition.newBuilder()
                                        .setSchema(schema)
                                        .setTimePartitioning(TimePartitioning.of(TimePartitioning.Type.HOUR))
                                        .build())
                        .setRequirePartitionFilter(
                                ingestSettings.getBigQueryStreamConfig().getRequirePartitionFilterInQueries())
                        .build();

        verify(bigQuery).create(tableInfo);

        List<InsertAllRequest.RowToInsert> rows = new ArrayList<>();
        rows.add(InsertAllRequest.RowToInsert.of(UUID.randomUUID().toString(),  Map.of("a", "test")));

        InsertAllResponse insertAllResponse = mock(InsertAllResponse.class);
        when(bigQuery.insertAll(any(InsertAllRequest.class))).thenReturn(insertAllResponse);
        verify(bigQuery).insertAll(InsertAllRequest.newBuilder(TableId.of("ds", "s8_eid_rid")).setRows(rows).build());
    }
}
