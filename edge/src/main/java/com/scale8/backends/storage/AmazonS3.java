package com.scale8.backends.storage;

import com.scale8.Env;
import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import javax.inject.Singleton;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@Replaces(StorageInterface.class)
@Singleton
@Requires(property = "backend-storage", value = "s3")
public class AmazonS3 implements StorageInterface {

  final Env env;
  S3Client storage;

  AmazonS3(Env env) {
    this.env = env;
  }

  private S3Client getStorage() {
    if (storage == null) {
      storage =
          S3Client.builder()
              .credentialsProvider(
                  StaticCredentialsProvider.create(
                      new AwsCredentials() {
                        @Override
                        public String accessKeyId() {
                          return env.AWS_ID;
                        }

                        @Override
                        public String secretAccessKey() {
                          return env.AWS_SECRET;
                        }
                      }))
              .region(Region.of(env.AWS_REGION.toLowerCase().replaceAll("_", "-")))
              .build();
    }
    return storage;
  }

  private String getSafeBucketName(String bucketName) {
    return bucketName.replaceAll("[^a-z0-9]+", "-");
  }

  @Override
  public String get(String bucket, String key) {
    String safeBucketName = getSafeBucketName(bucket);
    return new BufferedReader(
            new InputStreamReader(
                getStorage()
                    .getObject(GetObjectRequest.builder().bucket(safeBucketName).key(key).build())))
        .lines()
        .collect(Collectors.joining());
  }
}
