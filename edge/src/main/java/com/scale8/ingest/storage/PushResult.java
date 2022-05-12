package com.scale8.ingest.storage;

public class PushResult {
    private final int count;
    private final long bytes;
    private final String error;

    public PushResult(int count, long bytes) {
        this.count = count;
        this.bytes = bytes;
        this.error = null;
    }

    public PushResult(int count, long bytes, String error){
        this.count = count;
        this.bytes = bytes;
        this.error = error;
    }

    public boolean hasError() {
        return error != null;
    }

    public String getError() {
        return this.error;
    }

    public int getCount() {
        return count;
    }

    public long getBytes() {
        return bytes;
    }
}