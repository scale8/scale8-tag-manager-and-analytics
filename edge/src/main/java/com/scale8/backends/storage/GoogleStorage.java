package com.scale8.backends.storage;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.scale8.Env;
import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import javax.inject.Singleton;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Replaces(StorageInterface.class)
@Singleton
@Requires(property = "backend-storage", value = "google")
public class GoogleStorage implements StorageInterface {

  final Env env;
  Storage storage;

  GoogleStorage(Env env) {
    this.env = env;
  }

  private Storage getStorage() throws IOException {
    if (storage == null) {
      storage =
          StorageOptions.newBuilder()
              .setCredentials(
                  ServiceAccountCredentials.fromStream(
                      new FileInputStream(env.GOOGLE_CREDENTIALS_FILE)))
              .build()
              .getService();
    }
    return storage;
  }

  @Override
  public String get(String bucket, String key) throws IOException {
    Blob blob = getStorage().get(bucket, key);
    if (blob == null) {
      throw new FileNotFoundException("Unable to find " + key + " in " + bucket);
    }
    return new String(blob.getContent(), StandardCharsets.UTF_8);
  }
}
