package com.scale8.ingest.storage.backends;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.scale8.Env;
import com.scale8.config.structures.IngestSettings;
import com.scale8.config.structures.storage.S3Config;
import com.scale8.ingest.storage.PushResult;
import com.scale8.ingest.storage.StorageProvider;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import javax.inject.Singleton;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.zip.GZIPOutputStream;

@Singleton
public class PushToS3 extends StorageProvider {

  final Integer INITIAL_STREAM_SIZE = 65536;

  final Env env;

  PushToS3(Env env) {
    this.env = env;
  }

  @Override
  public PushResult push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q)
      throws IOException {

    int count = 0;
    long bytes = 0;

    if (!q.isEmpty()) {
      S3Config s3Config = ingestSettings.getS3Config();

      S3Client s3client =
          S3Client.builder()
              .credentialsProvider(
                  StaticCredentialsProvider.create(
                      new AwsCredentials() {
                        @Override
                        public String accessKeyId() {
                          return s3Config.getAccessKeyId();
                        }

                        @Override
                        public String secretAccessKey() {
                          return s3Config.getSecretAccessKey();
                        }
                      }))
              .region(Region.of(s3Config.getRegion().toLowerCase().replaceAll("_", "-")))
              .build();

      String key =
          "s8-data-ingest/"
              + ingestSettings.getIngestEndpointEnvironmentId()
              + "/"
              + ingestSettings.getIngestEndpointRevisionId()
              + "-"
              + env.SERVER_ID
              + "-"
              + System.currentTimeMillis()
              + ".gz";

      ByteArrayOutputStream stream = new ByteArrayOutputStream(INITIAL_STREAM_SIZE);
      GZIPOutputStream gzip = new GZIPOutputStream(stream, INITIAL_STREAM_SIZE);

      while (!q.isEmpty()) {
        ArrayList<JsonObject> nextBatch = getNextBatch(q);
        for (JsonObject jsonObject : nextBatch) {
          byte[] data = (new Gson().toJson(jsonObject) + "\n").getBytes(StandardCharsets.UTF_8);
          gzip.write(data);
          count++;
          bytes += data.length;
        }
      }
      gzip.close();

      s3client.putObject(
          PutObjectRequest.builder().bucket(s3Config.getBucketName()).key(key).build(),
          RequestBody.fromBytes(stream.toByteArray()));

      stream.flush();
      stream.close();
    }
    return new PushResult(count, bytes);
  }
}
