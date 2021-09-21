package com.scale8.ingest.storage;

import com.google.gson.JsonObject;
import com.scale8.config.structures.IngestSettings;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentLinkedQueue;

public abstract class StorageProvider {

  protected ArrayList<JsonObject> getNextBatch(ConcurrentLinkedQueue<JsonObject> q) {
    int pollMax = Math.max(q.size(), 1000);
    ArrayList<JsonObject> batch = new ArrayList<>();
    for (int i = 0; i < pollMax; i++) {
      JsonObject jsonObject = q.poll();
      if (jsonObject != null) {
        batch.add(jsonObject);
      }
    }
    return batch;
  }

  public abstract void push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q) throws Exception;
}
