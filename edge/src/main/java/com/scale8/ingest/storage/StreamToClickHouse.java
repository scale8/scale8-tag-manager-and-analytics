package com.scale8.ingest.storage;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.bigquery.*;
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
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Singleton
public class StreamToClickHouse extends StorageProvider {

  private static final Logger LOG = LoggerFactory.getLogger(StreamToClickHouse.class);

  final Env env;

  StreamToClickHouse(Env env) {
    this.env = env;
  }

  @Override
  public void push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q) {
//     try {
//       BigQuery bigQuery = getBigQueryInstance(ingestSettings);
//       TableId tableId = getTableId(ingestSettings);
//       buildMissingTable(bigQuery, ingestSettings);
//
//       while (!q.isEmpty()) {
//         List<InsertAllRequest.RowToInsert> rows =
//             getNextBatch(q).stream()
//                 .map(
//                     jsonObject ->
//                         InsertAllRequest.RowToInsert.of(
//                             UUID.randomUUID().toString(), convertJsonObject(jsonObject)))
//                 .collect(Collectors.toList());
//
//         InsertAllResponse response =
//             bigQuery.insertAll(InsertAllRequest.newBuilder(tableId).setRows(rows).build());
//         if (response.hasErrors()) {
//           LOG.error("BigQuery: " + response.toString());
//         }
//       }
//
//     } catch (Exception e) {
//       LOG.error("BigQuery: " + e.getMessage());
//     }
  }
}
