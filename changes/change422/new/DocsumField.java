// Copyright 2017 Yahoo Holdings. Licensed under the terms of the Apache 2.0 license. See LICENSE in the project root.
package com.yahoo.prelude.fastsearch;

import com.yahoo.data.access.Inspector;
import com.yahoo.log.LogLevel;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * @author Bjørn Borud
 * @author Steinar Knutsen
 */
public abstract class DocsumField {

    private static final Logger log = Logger.getLogger(DocsumField.class.getName());
    private static FieldFactory fieldFactory;

    private static class FieldFactory {

        Map<String, Constructor<? extends DocsumField>> constructors = new HashMap<>();

        void put(String typename, Class<? extends DocsumField> fieldClass)
                throws NoSuchMethodException, SecurityException {
            Constructor<? extends DocsumField> constructor = fieldClass.getConstructor(String.class);
            constructors.put(typename, constructor);
        }

        DocsumField create(String typename, String name)
                throws InstantiationException, IllegalAccessException,
                       IllegalArgumentException, InvocationTargetException {
            DocsumField f = constructors.get(typename).newInstance(name);
            return f;
        }
    }

    static {
        fieldFactory = new FieldFactory();

        try {
            fieldFactory.put("bool", BoolField.class);
            fieldFactory.put("byte", ByteField.class);
            fieldFactory.put("short", ShortField.class);
            fieldFactory.put("integer", IntegerField.class);
            fieldFactory.put("int64", Int64Field.class);
            fieldFactory.put("float16", Float16Field.class);
            fieldFactory.put("float", FloatField.class);
            fieldFactory.put("double", DoubleField.class);
            fieldFactory.put("string", StringField.class);
            fieldFactory.put("data", DataField.class);
            fieldFactory.put("longstring", LongstringField.class);
            fieldFactory.put("longdata", LongdataField.class);
            fieldFactory.put("jsonstring", StructDataField.class);
            fieldFactory.put("featuredata", FeatureDataField.class);
            fieldFactory.put("xmlstring", XMLField.class);
            fieldFactory.put("tensor", TensorField.class);
        } catch (Exception e) {
            log.log(LogLevel.ERROR, "Could not initialize docsum decoding properly.", e);
        }
    }

    protected String name;

    protected DocsumField(String name) {
        this.name = name;
    }

    public static DocsumField create(String name, String typename) {
        try {
            return fieldFactory.create(typename, name);
        } catch (Exception e) {
            throw new RuntimeException("Unknown field type '" + typename + "'", e);
        }
    }

    public String getName() {
        return name;
    }

    /**
     * Convert a generic value into an object of the appropriate type
     * for this field.
     */
    public abstract Object convert(Inspector value);

    /** Returns whether this is the string field type. */
    boolean isString() { return false; }

}
