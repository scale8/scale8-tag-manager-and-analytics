package com.scale8;

import com.scale8.mmdb.Geo;
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.runtime.Micronaut;
import io.micronaut.runtime.server.event.ServerStartupEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class Application implements ApplicationEventListener<ServerStartupEvent> {

  @Inject Env env;

  private static final Logger LOG = LoggerFactory.getLogger(Application.class);

  public static void main(String[] args) {
    Micronaut.run(Application.class, args);
  }

  @Override
  public void onApplicationEvent(ServerStartupEvent event) {
    LOG.info("Running in commercial mode? " + (env.IS_COMMERICAL ? "Yes" : "No"));
    LOG.info("Running in production mode? " + (env.IS_PROD ? "Yes" : "No"));
    LOG.info("Max-mind database location? " + env.MMDB_FILE);
    LOG.info("Server instance id? " + env.SERVER_ID);
  }
}
