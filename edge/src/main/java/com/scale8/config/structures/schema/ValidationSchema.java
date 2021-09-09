package com.scale8.config.structures.schema;

import com.google.gson.JsonPrimitive;

public class ValidationSchema {

  private String type;
  private JsonPrimitive input_value;

  public String getType() {
    return type;
  }

  public JsonPrimitive getInputValue() {
    return input_value;
  }
}
