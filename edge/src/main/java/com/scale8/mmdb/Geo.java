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

  @Cacheable()
  public GeoData getGeoData(String host) {
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
      if(subdivisionsNode != null && subdivisionsNode.isArray() && subdivisionsNode.has(0)){
        JsonNode first = subdivisionsNode.get(0);
        JsonNode name = first.findValue("names");
        if(name != null){
          region = name.findValue("en").asText();
        }
      }
      JsonNode cityNode = lookup.findValue("city");
      if(cityNode != null){
        JsonNode name = cityNode.findValue("names");
        if(name != null){
          city = name.findValue("en").asText();
        }
      }
    }
    return new GeoData(countryCode, region, city);
  }
}
