package com.scale8.mmdb;

public class GeoData {

    private final String countryCode;
    private final String region;
    private final String city;

    public GeoData(String countryCode, String region, String city) {
        this.countryCode = countryCode;
        this.region = region;
        this.city = city;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getRegion() {
        return region;
    }

    public String getCity() {
        return city;
    }
}
