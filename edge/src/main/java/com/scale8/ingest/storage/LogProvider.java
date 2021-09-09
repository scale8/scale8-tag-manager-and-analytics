package com.scale8.ingest.storage;

import com.google.gson.JsonObject;
import com.scale8.config.structures.IngestSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Singleton;
import java.util.concurrent.ConcurrentLinkedQueue;

@Singleton
public class LogProvider extends StorageProvider {

    private static final Logger LOG = LoggerFactory.getLogger(LogProvider.class);

    @Override
    public void push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q) {
        while (!q.isEmpty()) {
            getNextBatch(q).forEach(jsonObject -> LOG.info(jsonObject.toString()));
        }
    }
}
