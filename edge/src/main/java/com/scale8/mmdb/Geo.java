package com.scale8.mmdb;

import com.fasterxml.jackson.databind.JsonNode;
import com.maxmind.db.Reader;
import com.scale8.Env;
import io.micronaut.cache.annotation.CacheConfig;
import io.micronaut.cache.annotation.Cacheable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Singleton;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URL;

@Singleton
@CacheConfig("geo")
public class Geo {

  private final String STANDARD_RESPONSE = "--";
  private static final Logger LOG = LoggerFactory.getLogger(Geo.class);

  Reader GEO_DB;

  public Geo(Env env) {
    try {
      this.GEO_DB =
          new Reader(
              env.MMDB_FILE.startsWith("http")
                  ? new URL(env.MMDB_FILE).openStream()
                  : new FileInputStream(env.MMDB_FILE));
    } catch (IOException e) {
      LOG.warn(
          "Geo-IP-Lookup: Failed to find "
              + env.MMDB_FILE
              + " '"
              + STANDARD_RESPONSE
              + "' will be returned as country code for all IP lookups");
      this.GEO_DB = null;
    }
  }

  @Cacheable()
  public String getCountryCode(String host) {
    if (GEO_DB == null) {
      return STANDARD_RESPONSE;
    } else {
      try {
        JsonNode lookup = GEO_DB.get(InetAddress.getByName(host));
        if (lookup == null) {
          return null;
        } else {
          return lookup.findValue("country").findValue("iso_code").asText();
        }
      } catch (Exception e) {
        return STANDARD_RESPONSE;
      }
    }
  }
}
