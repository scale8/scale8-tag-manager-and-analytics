package com.scale8.config;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.scale8.config.structures.schema.TypeSchema;
import com.scale8.config.structures.schema.ValidationSchema;
import com.scale8.extended.ExtendedRequest;
import io.micronaut.core.convert.DefaultConversionService;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.simple.SimpleHttpHeaders;
import io.micronaut.http.simple.SimpleHttpParameters;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.*;

import javax.inject.Inject;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

import static org.mockito.Mockito.*;

@MicronautTest
class PayloadTest {
    @Inject
    Payload payload;

    private static ExtendedRequest request;

    private static ValidationSchema testValidationSchema;

    @SuppressWarnings("ResultOfMethodCallIgnored")
    @BeforeAll
    static void setUp() {
        @SuppressWarnings("unchecked")
        HttpRequest<String> req = mock(HttpRequest.class);
        Map<String, String> rawHeaders = new HashMap<>();
        rawHeaders.put("X-Forwarded-For", "xxxxxxx");
        SimpleHttpHeaders headers = new SimpleHttpHeaders(rawHeaders, new DefaultConversionService());
        when(req.getHeaders()).thenReturn(headers);
        Map<CharSequence, List<String>> params = new HashMap<>();
        params.put("foo", Arrays.asList("bar", "baz"));
        SimpleHttpParameters parameters =
                new SimpleHttpParameters(params, new DefaultConversionService());
        when(req.getParameters()).thenReturn(parameters);

        request = new ExtendedRequest(req, null, null, null);

        testValidationSchema = mock(ValidationSchema.class);
        when(testValidationSchema.getType()).thenReturn("VALID_STRING_MIN_LENGTH");
        when(testValidationSchema.getInputValue()).thenReturn(new JsonPrimitive(2));

        ThreadLocalRandom random = mock(ThreadLocalRandom.class);
        mockStatic(ThreadLocalRandom.class);
        when(ThreadLocalRandom.current()).thenReturn(random);
        when(random.nextInt(1, Integer.MAX_VALUE)).thenReturn(12345);
    }

    static TypeSchema buildTypeSchemaMock(
            String parent,
            String key,
            String combined,
            String var_type,
            JsonElement default_value,
            Boolean required,
            ValidationSchema[] validations) {
        TypeSchema typeSchema = mock(TypeSchema.class);
        when(typeSchema.getParent()).thenReturn(parent);
        when(typeSchema.getKey()).thenReturn(key);
        when(typeSchema.getCombined()).thenReturn(combined);
        when(typeSchema.getType()).thenReturn(var_type);
        when(typeSchema.getDefault()).thenReturn(default_value);
        when(typeSchema.getRequired()).thenReturn(required);
        when(typeSchema.getRepeated()).thenReturn(false);
        when(typeSchema.getValidations()).thenReturn(validations);

        return typeSchema;
    }

    static HashMap<String, TypeSchema> buildTypeDefaultTestSchemaMock(String stringDefault, Integer intDefault, String intMacro) {
        HashMap<String, TypeSchema> typeSchemaMap = new HashMap<>();

        JsonPrimitive defaultJsonString = stringDefault == null ? null : new JsonPrimitive(stringDefault);
        JsonPrimitive defaultJsonInt = intDefault == null ? null : new JsonPrimitive(intDefault);
        JsonPrimitive defaultJsonIntMacro = intMacro == null ? null : new JsonPrimitive(intMacro);
        JsonArray defaultJsonStringArray = new JsonArray(2);
        defaultJsonStringArray.add(defaultJsonString);
        defaultJsonStringArray.add(defaultJsonString);
        typeSchemaMap.put(
                "a",
                buildTypeSchemaMock(
                        null,
                        "a",
                        "a",
                        "STRING",
                        defaultJsonString,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "b",
                buildTypeSchemaMock(
                        null,
                        "b",
                        "b",
                        "INT",
                        defaultJsonInt,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "c",
                buildTypeSchemaMock(
                        null,
                        "c",
                        "c",
                        "INT",
                        defaultJsonIntMacro,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "arr",
                buildTypeSchemaMock(
                        null,
                        "arr",
                        "arr",
                        "ARRAY_STRING",
                        defaultJsonStringArray,
                        false,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.ao",
                buildTypeSchemaMock(
                        "o",
                        "ao",
                        "o.ao",
                        "STRING",
                        defaultJsonString,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.bo",
                buildTypeSchemaMock(
                        "o",
                        "bo",
                        "o.bo",
                        "INT",
                        defaultJsonInt,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.oo.aoo",
                buildTypeSchemaMock(
                        "o.oo",
                        "aoo",
                        "o.oo.aoo",
                        "STRING",
                        defaultJsonString,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.oo.b",
                buildTypeSchemaMock(
                        "o.oo",
                        "boo",
                        "o.oo.boo",
                        "INT",
                        defaultJsonInt,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.oo", buildTypeSchemaMock("o", "oo", "o.oo", "OBJECT", null, true, new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o", buildTypeSchemaMock(null, "o", "o", "OBJECT", null, true, new ValidationSchema[]{}));

        return typeSchemaMap;
    }


    static HashMap<String, TypeSchema> buildTypeDefaultTestSchemaObjectArraysMock() {
        HashMap<String, TypeSchema> typeSchemaMap = new HashMap<>();

        JsonPrimitive defaultJsonString = new JsonPrimitive("%S8_USER_IP%");
        JsonPrimitive defaultJsonIntMacro = new JsonPrimitive("%S8_RANDOM_INTEGER%");

        typeSchemaMap.put(
                "o.ao",
                buildTypeSchemaMock(
                        "o",
                        "ao",
                        "o.ao",
                        "STRING",
                        defaultJsonString,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.bo",
                buildTypeSchemaMock(
                        "o",
                        "bo",
                        "o.bo",
                        "INT",
                        defaultJsonIntMacro,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.oo.aoo",
                buildTypeSchemaMock(
                        "o.oo",
                        "aoo",
                        "o.oo.aoo",
                        "STRING",
                        defaultJsonString,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.oo.b",
                buildTypeSchemaMock(
                        "o.oo",
                        "boo",
                        "o.oo.boo",
                        "INT",
                        defaultJsonIntMacro,
                        true,
                        new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.oo", buildTypeSchemaMock("o", "oo", "o.oo", "ARRAY_OBJECT", null, true, new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o", buildTypeSchemaMock(null, "o", "o", "ARRAY_OBJECT", null, true, new ValidationSchema[]{}));

        return typeSchemaMap;
    }

    @Test
    void applyDefaultValues() {
        JsonObject secondInnerObject = new JsonObject();
        JsonObject innerObject = new JsonObject();
        JsonObject testPayload = new JsonObject();
        testPayload.add("a", null);
        innerObject.add("oo", secondInnerObject);
        testPayload.add("o", innerObject);

        HashMap<String, TypeSchema> typeSchemaMap = buildTypeDefaultTestSchemaMock(
                "test",
                2,
                null
        );

        Assertions.assertEquals(
                "{\"arr\":[\"test\",\"test\"],\"b\":2,\"o\":{\"oo\":{\"boo\":2,\"aoo\":\"test\"},\"ao\":\"test\",\"bo\":2}}",
                payload
                        .applyDefaultValues(testPayload, typeSchemaMap, new Replacements(request, null, null))
                        .toString());

        typeSchemaMap = buildTypeDefaultTestSchemaMock(
                "%S8_USER_IP%",
                3,
                "%S8_RANDOM_INTEGER%"
        );

        // Macros are not replaced within array defaults, the other macros are replaced correctly
        Assertions.assertEquals(
                "{\"arr\":[\"%S8_USER_IP%\",\"%S8_USER_IP%\"],\"b\":3,\"c\":12345,\"o\":{\"oo\":{\"boo\":3,\"aoo\":\"xxxxxxx\"},\"ao\":\"xxxxxxx\",\"bo\":3}}",
                payload
                        .applyDefaultValues(testPayload, typeSchemaMap, new Replacements(request, null, null))
                        .toString());

        // If the macro result is null the field removed from the resulting payload
        typeSchemaMap = buildTypeDefaultTestSchemaMock(
                "%S8_USER_AGENT%",
                2,
                "%S8_USER_AGENT%"
        );

        Assertions.assertEquals(
                "{\"arr\":[\"%S8_USER_AGENT%\",\"%S8_USER_AGENT%\"],\"b\":2,\"o\":{\"oo\":{\"boo\":2},\"bo\":2}}",
                payload
                        .applyDefaultValues(testPayload, typeSchemaMap, new Replacements(request, null, null))
                        .toString());

        // Object Arrays

        JsonObject testArrayPayload = new JsonObject();
        JsonObject secondInnerArrayObject = new JsonObject();
        JsonObject innerArrayObject = new JsonObject();
        JsonArray innerJsonObjectArray = new JsonArray(2);
        innerJsonObjectArray.add(secondInnerArrayObject);
        innerJsonObjectArray.add(secondInnerArrayObject);
        innerArrayObject.add("oo", innerJsonObjectArray);
        JsonArray jsonObjectArray = new JsonArray(2);
        jsonObjectArray.add(innerArrayObject);
        jsonObjectArray.add(innerArrayObject);
        testArrayPayload.add("o", jsonObjectArray);

        typeSchemaMap = buildTypeDefaultTestSchemaObjectArraysMock(
        );

        Assertions.assertEquals(
                "{\"o\":[{\"oo\":[{\"boo\":12345,\"aoo\":\"xxxxxxx\"},{\"boo\":12345,\"aoo\":\"xxxxxxx\"}],\"ao\":\"xxxxxxx\",\"bo\":12345},{\"oo\":[{\"boo\":12345,\"aoo\":\"xxxxxxx\"},{\"boo\":12345,\"aoo\":\"xxxxxxx\"}],\"ao\":\"xxxxxxx\",\"bo\":12345}]}",
                payload
                        .applyDefaultValues(testArrayPayload, typeSchemaMap, new Replacements(request, null, null))
                        .toString());
    }


    @Test
    void validateSchemaAgainstPayload() {
        JsonObject innerObject = new JsonObject();
        innerObject.addProperty("c", "object string");
        JsonObject validPayload = new JsonObject();
        validPayload.addProperty("a", "string value");
        validPayload.addProperty("b", 1);
        validPayload.add("o", innerObject);

        JsonObject invalidPayload = new JsonObject();
        invalidPayload.addProperty("a", "o");
        invalidPayload.addProperty("b", "z");

        JsonObject emptyPayload = new JsonObject();

        HashMap<String, TypeSchema> typeSchemaMap = new HashMap<>();

        typeSchemaMap.put(
                "a",
                buildTypeSchemaMock(
                        null, "a", "a", "STRING", null, true, new ValidationSchema[]{testValidationSchema}));

        typeSchemaMap.put(
                "b", buildTypeSchemaMock(null, "b", "b", "INT", null, false, new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o", buildTypeSchemaMock(null, "o", "o", "OBJECT", null, true, new ValidationSchema[]{}));

        typeSchemaMap.put(
                "o.c",
                buildTypeSchemaMock(
                        "o",
                        "c",
                        "o.c",
                        "STRING",
                        new JsonPrimitive("obj inner"),
                        false,
                        new ValidationSchema[]{}));

        Assertions.assertEquals(
                payload.validateSchemaAgainstPayload(validPayload, typeSchemaMap), Collections.emptyList());

        Assertions.assertEquals(
                payload.validateSchemaAgainstPayload(invalidPayload, typeSchemaMap),
                Arrays.asList(
                        "o has not reached the minimum accepted length",
                        "Property 'b' on 'root object' should be of type INT",
                        "Property 'o' is required on 'root object'"));

        Assertions.assertEquals(
                Arrays.asList(
                        "Property 'a' is required on 'root object'",
                        "Property 'o' is required on 'root object'"),
                payload.validateSchemaAgainstPayload(emptyPayload, typeSchemaMap));
    }
}
