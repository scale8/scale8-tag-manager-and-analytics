package com.scale8.ingest.storage.backends;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.scale8.config.structures.IngestSettings;
import com.scale8.ingest.storage.PushResult;
import com.scale8.ingest.storage.StorageProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Singleton;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentLinkedQueue;

@Singleton
public class LogProvider extends StorageProvider {

  private static final Logger LOG = LoggerFactory.getLogger(LogProvider.class);

  @Override
  public PushResult push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q) {

    int count = 0;
    long bytes = 0;

    while (!q.isEmpty()) {
      ArrayList<JsonObject> nextBatch = getNextBatch(q);
      for (JsonObject jsonObject : nextBatch) {
        String data = new Gson().toJson(jsonObject);
        LOG.info(data);
        count++;
        bytes += data.getBytes(StandardCharsets.UTF_8).length;
      }
    }

    return new PushResult(count, bytes);
  }
}
