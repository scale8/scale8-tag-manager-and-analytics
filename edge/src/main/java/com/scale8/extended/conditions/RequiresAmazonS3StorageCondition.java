package com.scale8.extended.conditions;

import com.scale8.Env;
import io.micronaut.context.condition.Condition;
import io.micronaut.context.condition.ConditionContext;

public class RequiresAmazonS3StorageCondition implements Condition {
  @Override
  public boolean matches(ConditionContext context) {
    final Env env = context.getBeanContext().getBean(Env.class);
    return !env.IS_COMMERICAL && env.STORAGE_BACKEND.equals("s3");
  }
}
