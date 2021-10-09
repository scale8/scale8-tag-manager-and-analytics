package com.scale8.util;

import org.apache.commons.codec.binary.Hex;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class HashUtil {
  public static String createHash(String input) throws NoSuchAlgorithmException {
    return Hex.encodeHexString(
        MessageDigest.getInstance("SHA-256").digest(input.getBytes(StandardCharsets.UTF_8)));
  }
}
