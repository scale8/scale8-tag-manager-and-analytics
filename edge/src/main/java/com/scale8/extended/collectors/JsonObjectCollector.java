package com.scale8.extended.collectors;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.scale8.extended.types.Tuple;

import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collector;

public class JsonObjectCollector
    implements Collector<Tuple<String, JsonElement>, JsonObject, JsonObject> {

  @Override
  public Supplier<JsonObject> supplier() {
    return JsonObject::new;
  }

  @Override
  public BiConsumer<JsonObject, Tuple<String, JsonElement>> accumulator() {
    return (jsonObject, tuple) -> jsonObject.add(tuple.x, tuple.y);
  }

  @Override
  public BinaryOperator<JsonObject> combiner() {
    return (jsonObject, jsonObject2) -> {
      jsonObject2.entrySet().forEach((e) -> jsonObject.add(e.getKey(), e.getValue()));
      return jsonObject;
    };
  }

  @Override
  public Function<JsonObject, JsonObject> finisher() {
    return (jsonObject) -> jsonObject;
  }

  @Override
  public Set<Characteristics> characteristics() {
    return Set.of(Characteristics.UNORDERED);
  }
}
