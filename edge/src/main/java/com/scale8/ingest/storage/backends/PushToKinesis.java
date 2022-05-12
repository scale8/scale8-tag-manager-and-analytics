package com.scale8.ingest.storage.backends;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.scale8.Env;
import com.scale8.config.structures.IngestSettings;
import com.scale8.config.structures.storage.KinesisConfig;
import com.scale8.ingest.storage.PushResult;
import com.scale8.ingest.storage.StorageProvider;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.firehose.FirehoseClient;
import javax.inject.Singleton;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

import software.amazon.awssdk.services.firehose.model.PutRecordBatchRequest;
import software.amazon.awssdk.services.firehose.model.Record;

@Singleton
public class PushToKinesis extends StorageProvider {

  final Env env;

  PushToKinesis(Env env) {
    this.env = env;
  }

  @Override
  public PushResult push(IngestSettings ingestSettings, ConcurrentLinkedQueue<JsonObject> q)
      throws IOException {

    int count = 0;
    long bytes = 0;

    if (!q.isEmpty()) {
      KinesisConfig kinesisConfig = ingestSettings.getKinesisConfig();

      FirehoseClient firehoseClient =
          FirehoseClient.builder()
              .credentialsProvider(
                  StaticCredentialsProvider.create(
                      new AwsCredentials() {
                        @Override
                        public String accessKeyId() {
                          return kinesisConfig.getAccessKeyId();
                        }

                        @Override
                        public String secretAccessKey() {
                          return kinesisConfig.getSecretAccessKey();
                        }
                      }))
              .region(Region.of(kinesisConfig.getRegion().toLowerCase().replaceAll("_", "-")))
              .build();

      try {
        while (!q.isEmpty()) {
          ArrayList<JsonObject> nextBatch = getNextBatch(q);
          List<Record> recordList = new ArrayList<>();
          for (JsonObject jsonObject : nextBatch) {
            byte[] data = (new Gson().toJson(jsonObject) + "\n").getBytes(StandardCharsets.UTF_8);
            recordList.add(Record.builder().data(SdkBytes.fromByteArray(data)).build());
            count++;
            bytes += data.length;
          }
          PutRecordBatchRequest recordBatchRequest =
              PutRecordBatchRequest.builder()
                  .deliveryStreamName(kinesisConfig.getStreamName())
                  .records(recordList)
                  .build();
          firehoseClient.putRecordBatch(recordBatchRequest);
        }
      } finally {
        firehoseClient.close();
      }
    }
    return new PushResult(count, bytes);
  }
}
