package com.scale8.backends.storage;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.scale8.Env;
import com.scale8.extended.conditions.RequiresGoogleStorageRequestedCondition;
import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import javax.inject.Singleton;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Replaces(StorageInterface.class)
@Singleton
@Requires(condition = RequiresGoogleStorageRequestedCondition.class)
public class GoogleStorage implements StorageInterface {

  final Env env;
  Storage storage;

  GoogleStorage(Env env) {
    this.env = env;
  }

  private Storage getStorage() throws IOException {
    if (storage == null) {
      ServiceAccountCredentials credentials;
      if (!env.GOOGLE_CREDENTIALS.equals("")) {
        credentials =
            ServiceAccountCredentials.fromStream(
                new ByteArrayInputStream(
                    env.GOOGLE_CREDENTIALS.trim().getBytes(StandardCharsets.UTF_8)));
      } else {
        credentials =
            ServiceAccountCredentials.fromStream(new FileInputStream(env.GOOGLE_CREDENTIALS_FILE));
      }
      storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
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
