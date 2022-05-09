package com.scale8.ingest;

import com.google.gson.JsonObject;
import com.scale8.Env;
import com.scale8.config.structures.IngestSettings;
import com.scale8.extended.types.Tuple;
import com.scale8.ingest.storage.*;
import com.spencerwi.either.Either;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Singleton
public class Ingestor {

  @Inject Env env;

  @Inject PushToBigQuery pushToBigQuery;

  @Inject PushToMongoDb pushToMongoDb;

  @Inject PushToS3 pushToS3;

  @Inject PushToKinesis pushToKinesis;

  @Inject LogProvider logProvider;

  private static final Logger LOG = LoggerFactory.getLogger(Ingestor.class);

  private static final ConcurrentHashMap<
          String, ConcurrentHashMap<Long, ConcurrentLinkedQueue<JsonObject>>>
      revisionData = new ConcurrentHashMap<>();

  private static final HashMap<String, String> revisionToEnvironment = new HashMap<>();
  private static final HashMap<String, IngestSettings> environmentIngestSettings = new HashMap<>();

  private long getCurrentWritableWindow() {
    return System.currentTimeMillis() / 1000 / env.INGEST_WINDOW_SIZE_SECONDS;
  }

  public void add(JsonObject payload, IngestSettings ingestSettings) {
    //this needs to be kept fresh.
    environmentIngestSettings.put(
        ingestSettings.getIngestEndpointEnvironmentId(), ingestSettings);
    String revisionId = ingestSettings.getIngestEndpointRevisionId();
    revisionToEnvironment.put(revisionId, ingestSettings.getIngestEndpointEnvironmentId());
    revisionData.putIfAbsent(revisionId, new ConcurrentHashMap<>());

    ConcurrentHashMap<Long, ConcurrentLinkedQueue<JsonObject>> timeWindowMap =
        revisionData.get(revisionId);

    long currentWindow = getCurrentWritableWindow();
    ConcurrentLinkedQueue<JsonObject> writableWindow = timeWindowMap.get(currentWindow);
    if (writableWindow == null) {
      ConcurrentLinkedQueue<JsonObject> q = new ConcurrentLinkedQueue<>();
      q.add(payload);
      timeWindowMap.put(currentWindow, q);
    } else {
      writableWindow.add(payload);
    }
  }

  public void push() throws Exception {
    ExecutorService executorService = Executors.newFixedThreadPool(env.INGEST_MAX_THREADS);
    long currentWindow = getCurrentWritableWindow();

    ArrayList<Tuple<IngestSettings, ConcurrentLinkedQueue<JsonObject>>> qJobs = new ArrayList<>();
    for (Map.Entry<String, ConcurrentHashMap<Long, ConcurrentLinkedQueue<JsonObject>>>
        revisionTimeWindows : revisionData.entrySet()) {
      String revisionId = revisionTimeWindows.getKey();
      ConcurrentHashMap<Long, ConcurrentLinkedQueue<JsonObject>> timeWindowMap =
          revisionTimeWindows.getValue();

      if (timeWindowMap.isEmpty()) {
        revisionData.remove(
            revisionId); // we can safely remove revisionId (no more time-windows used).
      } else {
        // we have time-window data to push up...
        for (Map.Entry<Long, ConcurrentLinkedQueue<JsonObject>> timeWindow :
            timeWindowMap.entrySet()) {

          Long window = timeWindow.getKey();
          if (window < currentWindow) {
            // window is complete (no more entries)
            ConcurrentLinkedQueue<JsonObject> q = timeWindow.getValue();

            if (q.isEmpty()) {
              timeWindowMap.remove(window); // has been drained, so we can safely remove the queue
            } else {
              qJobs.add(
                  new Tuple<>(
                      environmentIngestSettings.get(revisionToEnvironment.get(revisionId)), q));
            }
          }
        }
      }
    }

    List<Future<Either<Boolean, Exception>>> runningJobs =
        qJobs.stream()
            .map(
                job ->
                    executorService.submit(
                        () -> {
                          LOG.info("Starting job");
                          try {
                            IngestSettings ingestSettings = job.x;
                            String storageProvider = ingestSettings.getStorageProvider();
                            switch (storageProvider) {
                              case "MONGODB":
                                pushToMongoDb.push(ingestSettings, job.y);
                                return Either.<Boolean, Exception>left(true);
                              case "GC_BIGQUERY_STREAM":
                                pushToBigQuery.push(ingestSettings, job.y);
                                return Either.<Boolean, Exception>left(true);
                              case "AWS_S3":
                                pushToS3.push(ingestSettings, job.y);
                                return Either.<Boolean, Exception>left(true);
                              case "AWS_KINESIS":
                                pushToKinesis.push(ingestSettings, job.y);
                                return Either.<Boolean, Exception>left(true);
                              default:
                                logProvider.push(ingestSettings, job.y);
                                return Either.<Boolean, Exception>right(
                                    new Exception(storageProvider + " is not supported"));
                            }
                          } catch (Exception e) {
                            return Either.<Boolean, Exception>right(e);
                          }
                        }))
            .collect(Collectors.toList());

    executorService.shutdown();
    if (!executorService.awaitTermination(env.INGEST_TIMEOUT_JOBS_SECONDS, TimeUnit.SECONDS)) {
      LOG.error("Failed to execute within timeframe...");
      executorService.shutdownNow();
    }

    for (Future<Either<Boolean, Exception>> runningJob : runningJobs) {
      if (runningJob.get().isRight()) {
        LOG.error(runningJob.get().getRight().getMessage(), runningJob.get().getRight());
      }
    }
  }
}
