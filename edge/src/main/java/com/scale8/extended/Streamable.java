package com.scale8.extended;

import java.util.Iterator;
import java.util.stream.Stream;

public class Streamable {
  public static <T> Stream<T> iteratorToStream(Iterator<T> iterator) {
    return Stream.generate(() -> null).takeWhile(n -> iterator.hasNext()).map(n -> iterator.next());
  }
}
