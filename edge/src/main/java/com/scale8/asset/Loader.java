package com.scale8.asset;

import io.micronaut.core.io.ResourceLoader;

import javax.inject.Singleton;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

@Singleton
public class Loader {

  private final ResourceLoader resourceLoader;

  Loader(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
  }

  public String getResourceAsString(String uri) throws IOException {
    Optional<InputStream> resource = getResourceAsInputStream(uri);
    if (resource.isPresent()) {
      return new String(resource.get().readAllBytes());
    } else {
      throw new FileNotFoundException("Failed to find resource " + uri);
    }
  }

  public Optional<InputStream> getResourceAsInputStream(String uri) {
    return resourceLoader.getResourceAsStream(uri);
  }
}
