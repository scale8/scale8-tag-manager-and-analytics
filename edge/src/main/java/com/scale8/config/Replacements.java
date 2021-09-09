package com.scale8.config;

import com.scale8.config.structures.AppSettings;
import com.scale8.config.structures.IngestSettings;
import com.scale8.extended.ExtendedRequest;

public class Replacements {

    final ExtendedRequest request;
    final IngestSettings ingestSettings;
    final AppSettings appSettings;

    public Replacements(
            ExtendedRequest request,
            IngestSettings ingestSettings,
            AppSettings appSettings) {
        this.request = request;
        this.ingestSettings = ingestSettings;
        this.appSettings = appSettings;
    }

    public ExtendedRequest getRequest() {
        return request;
    }

    public IngestSettings getIngestSettings() {
        return ingestSettings;
    }

    public AppSettings getAppSettings() {
        return appSettings;
    }
}
