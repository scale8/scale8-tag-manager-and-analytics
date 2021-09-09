package com.scale8.extended.collectors;

import com.scale8.extended.types.Tuple;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collector;

public class TupleCollector<X, Y> implements Collector<Tuple<X, Y>, Map<X, Y>, Map<X, Y>> {

  @Override
  public Supplier<Map<X, Y>> supplier() {
    return HashMap::new;
  }

  @Override
  public BiConsumer<Map<X, Y>, Tuple<X, Y>> accumulator() {
    return (map, tuple) -> map.put(tuple.x, tuple.y);
  }

  @Override
  public BinaryOperator<Map<X, Y>> combiner() {
    return (m, m2) -> {
      m2.forEach(m::put);
      return m;
    };
  }

  @Override
  public Function<Map<X, Y>, Map<X, Y>> finisher() {
    return (m) -> m;
  }

  @Override
  public Set<Characteristics> characteristics() {
    return Set.of(Characteristics.UNORDERED);
  }
}
