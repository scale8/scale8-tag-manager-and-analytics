package com.scale8;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.runtime.EmbeddedApplication;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import javax.inject.Inject;

import static org.junit.jupiter.api.Assertions.assertFalse;

@MicronautTest
class GetAssetsTest {

    @Inject
    EmbeddedApplication<?> application;

    @Inject
    @Client("/")
    HttpClient client;

    @Test
    void testApplicationRuns() {
        Assertions.assertTrue(application.isRunning());
    }

    @Test
    void testFetchesAnalyticsJs() {
        Assertions.assertTrue(application.isRunning());
        final String result = client.toBlocking().retrieve(HttpRequest.GET("/analytics.js"));
        assertFalse(result.isEmpty());
    }

    @Test
    void testFetchesTmJs() {
        Assertions.assertTrue(application.isRunning());
        final String result = client.toBlocking().retrieve(HttpRequest.GET("/tm.js"));
        assertFalse(result.isEmpty());
    }

}
