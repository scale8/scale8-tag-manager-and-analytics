package com.scale8.backends.storage;

import javax.inject.Singleton;
import java.io.IOException;

@Singleton
public interface StorageInterface {
  String get(String bucket, String key) throws IOException;
}
