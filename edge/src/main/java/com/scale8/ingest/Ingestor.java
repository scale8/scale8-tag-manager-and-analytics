package com.scale8.ingest;

import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.scale8.Env;
import com.scale8.config.Payload;
import com.scale8.config.structures.IngestSettings;
import com.scale8.extended.types.Tuple;
import com.scale8.ingest.storage.*;
import com.scale8.ingest.storage.backends.*;
import com.spencerwi.either.Either;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Singleton
public class Ingestor {

  @Inject Env env;

  @Inject Payload payload;

  @Inject PushToBigQuery pushToBigQuery;

  @Inject PushToMongoDb pushToMongoDb;

  @Inject PushToS3 pushToS3;

  @Inject PushToKinesis pushToKinesis;

  @Inject LogProvider logProvider;

  private static final Logger LOG = LoggerFactory.getLogger(Ingestor.class);

  private static final ConcurrentHashMap<
          String, ConcurrentHashMap<Long, ConcurrentLinkedQueue<JsonObject>>>
      revisionData = new ConcurrentHashMap<>();

  private static final HashMap<String, String> revisionToEnvironmentMap = new HashMap<>();
  private static final HashMap<String, IngestSettings> environmentToIngestSettingsMap =
      new HashMap<>();
  private static final HashMap<String, IngestSettings> environmentToUsageIngestSettingsMap =
      new HashMap<>();

  private long getCurrentWritableWindow() {
    return System.currentTimeMillis() / 1000 / env.INGEST_WINDOW_SIZE_SECONDS;
  }

  public void add(
      JsonObject payload, IngestSettings ingestSettings, IngestSettings usageIngestSettings) {
    String environmentId = ingestSettings.getIngestEndpointEnvironmentId();
    environmentToUsageIngestSettingsMap.put(environmentId, usageIngestSettings);
    add(payload, ingestSettings);
  }

  public void add(JsonObject payload, IngestSettings ingestSettings) {
    String environmentId = ingestSettings.getIngestEndpointEnvironmentId();
    String revisionId = ingestSettings.getIngestEndpointRevisionId();

    environmentToIngestSettingsMap.put(environmentId, ingestSettings);
    revisionToEnvironmentMap.put(revisionId, ingestSettings.getIngestEndpointEnvironmentId());

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

  private void trackUsage(IngestSettings ingestSettings, PushResult pushResult) {
    if (!ingestSettings.getUsageIngestEnvId().isEmpty() && ingestSettings.getIsAnalyticsEnabled()) {
      String environmentId = ingestSettings.getIngestEndpointEnvironmentId();
      String revisionId = ingestSettings.getIngestEndpointRevisionId();
      IngestSettings usageIngestSettings = environmentToUsageIngestSettingsMap.get(environmentId);

      JsonObject payloadObject = new JsonObject();
      payloadObject.add(
          "dt",
          new JsonPrimitive(
              LocalDateTime.now(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_DATE_TIME)));
      payloadObject.add("env_id", new JsonPrimitive(environmentId));
      payloadObject.add("revision_id", new JsonPrimitive(revisionId));
      payloadObject.add("requests", new JsonPrimitive(pushResult.getCount()));
      payloadObject.add("bytes", new JsonPrimitive(pushResult.getBytes()));

      if (pushResult.hasError()) {
        payloadObject.add("error", new JsonPrimitive(pushResult.getError()));
      }

      List<String> trackingIssues =
          payload.validateSchemaAgainstPayload(payloadObject, usageIngestSettings.getSchemaAsMap());
      if (trackingIssues.isEmpty()) {
        // go ahead and log this...
        add(payloadObject, usageIngestSettings);
      } else {
        LOG.error("Failed to track usage on ingest endpoint");
      }
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
                      environmentToIngestSettingsMap.get(revisionToEnvironmentMap.get(revisionId)),
                      q));
            }
          }
        }
      }
    }

    List<Future<Either<Tuple<PushResult, IngestSettings>, Tuple<Exception, IngestSettings>>>>
        runningJobs =
            qJobs.stream()
                .map(
                    job ->
                        executorService.submit(
                            () -> {
                              LOG.info("Starting job");
                              IngestSettings ingestSettings = job.x;
                              try {
                                String storageProvider = ingestSettings.getStorageProvider();
                                switch (storageProvider) {
                                  case "MONGODB":
                                    return Either
                                        .<Tuple<PushResult, IngestSettings>,
                                            Tuple<Exception, IngestSettings>>
                                            left(
                                                new Tuple<>(
                                                    pushToMongoDb.push(ingestSettings, job.y),
                                                    ingestSettings));
                                  case "GC_BIGQUERY_STREAM":
                                    return Either
                                        .<Tuple<PushResult, IngestSettings>,
                                            Tuple<Exception, IngestSettings>>
                                            left(
                                                new Tuple<>(
                                                    pushToBigQuery.push(ingestSettings, job.y),
                                                    ingestSettings));
                                  case "AWS_S3":
                                    return Either
                                        .<Tuple<PushResult, IngestSettings>,
                                            Tuple<Exception, IngestSettings>>
                                            left(
                                                new Tuple<>(
                                                    pushToS3.push(ingestSettings, job.y),
                                                    ingestSettings));
                                  case "AWS_KINESIS":
                                    return Either
                                        .<Tuple<PushResult, IngestSettings>,
                                            Tuple<Exception, IngestSettings>>
                                            left(
                                                new Tuple<>(
                                                    pushToKinesis.push(ingestSettings, job.y),
                                                    ingestSettings));
                                  default:
                                    logProvider.push(ingestSettings, job.y);
                                    return Either
                                        .<Tuple<PushResult, IngestSettings>,
                                            Tuple<Exception, IngestSettings>>
                                            right(
                                                new Tuple<>(
                                                    new Exception(
                                                        storageProvider + " is not supported"),
                                                    ingestSettings));
                                }
                              } catch (Exception e) {
                                return Either
                                    .<Tuple<PushResult, IngestSettings>,
                                        Tuple<Exception, IngestSettings>>
                                        right(new Tuple<>(e, ingestSettings));
                              }
                            }))
                .collect(Collectors.toList());

    executorService.shutdown();
    if (!executorService.awaitTermination(env.INGEST_TIMEOUT_JOBS_SECONDS, TimeUnit.SECONDS)) {
      LOG.error("Failed to execute within timeframe...");
      executorService.shutdownNow();
    }

    for (Future<Either<Tuple<PushResult, IngestSettings>, Tuple<Exception, IngestSettings>>>
        runningJob : runningJobs) {
      if (runningJob.get().isLeft()) {
        Tuple<PushResult, IngestSettings> res = runningJob.get().getLeft();
        LOG.info("Pushed " + res.x.getCount() + " records (" +  res.x.getBytes() + " bytes)");
        trackUsage(res.y, res.x);
      } else if (runningJob.get().isRight()) {
        Tuple<Exception, IngestSettings> err = runningJob.get().getRight();
        LOG.error(err.x.getMessage());
        trackUsage(
            err.y,
            new PushResult(
                1,
                0,
                "Failed to connect and stream to backend. Please check your credentials are correct."));
      }
    }
  }
}
