package com.scale8.config.structures.schema;

import com.google.gson.JsonElement;

public class TypeSchema {

  private String parent;
  private String key;
  private String combined;
  private String var_type;
  private JsonElement default_value;
  private Boolean required;
  private Boolean repeated;
  private ValidationSchema[] validations;

  public String getParent() {
    return parent;
  }

  public String getKey() {
    return key;
  }

  public String getCombined() {
    return combined;
  }

  public String getType() {
    return var_type;
  }

  public JsonElement getDefault() {
    return default_value;
  }

  public Boolean getRequired() {
    return required;
  }

  public Boolean getRepeated() {
    return repeated;
  }

  public ValidationSchema[] getValidations() {
    return validations;
  }
}
