package com.scale8.mmdb;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.maxmind.db.Reader;
import com.scale8.Env;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.inject.Singleton;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@Singleton
public class Geo {

  private final Cache<String, GeoData> cache =
      Caffeine.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES).maximumSize(1000).build();

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
      LOG.warn("Geo-IP-Lookup: Failed to find IP database" + env.MMDB_FILE);
      this.GEO_DB = null;
    }
  }

  private JsonNode getLookUp(String host) {
    if (GEO_DB == null) {
      return null;
    }
    try {
      return GEO_DB.get(InetAddress.getByName(host));
    } catch (Exception e) {
      return null;
    }
  }

  public GeoData getGeoData(String host) {
    GeoData geoData = cache.getIfPresent(host);
    if (geoData == null) {
      LOG.info("Going back to " + GEO_DB + " to fetch " + host + ", not present in cache");
      String countryCode = null;
      String region = null;
      String city = null;
      JsonNode lookup = getLookUp(host);
      if (lookup != null) {
        JsonNode countryNode = lookup.findValue("country");
        if (countryNode != null) {
          countryCode = countryNode.findValue("iso_code").asText();
        }
        JsonNode subdivisionsNode = lookup.findValue("subdivisions");
        if (subdivisionsNode != null && subdivisionsNode.isArray() && subdivisionsNode.has(0)) {
          JsonNode first = subdivisionsNode.get(0);
          JsonNode name = first.findValue("names");
          if (name != null) {
            region = name.findValue("en").asText();
          }
        }
        JsonNode cityNode = lookup.findValue("city");
        if (cityNode != null) {
          JsonNode name = cityNode.findValue("names");
          if (name != null) {
            city = name.findValue("en").asText();
          }
        }
      }
      GeoData freshGeoData = new GeoData(countryCode, region, city);
      cache.put(host, freshGeoData);
      return freshGeoData;
    } else {
      return geoData;
    }
  }
}
