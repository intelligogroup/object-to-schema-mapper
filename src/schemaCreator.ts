import { SomeObj, ValArchtype } from './utils/types';
import { resolveValueArchtype, resolveType } from './utils/generalUtil';

function mapObjectToSchema(obj: SomeObj, schema: SomeObj = {}): SomeObj {
    return Object
        .keys(obj)
        .reduce(
            (schema, key) => resolveOperation(schema, obj, key),
            schema
        );
}

function handleEmptyValue(schema: SomeObj, key: string) {
    const value = schema[key];
    if (value == null || value == 'unknown') {
        return unknownType(schema, key);
    }
    return schema;
}

function resolveStrategy(obj: ValArchtype, schema: ValArchtype): Function {
    if (
        obj == 'SIMPLE' && schema == 'EMPTY'
    ) {
        return substitution;
    } else if (
        obj == 'EMPTY'
        || obj == 'SIMPLE' && schema != 'SIMPLE'
    ) {
        return discard;
    } else if (
        obj == 'ARRAY' && (schema == 'EMPTY' || schema == 'ARRAY')
    ) {
        return arrayRecursion;
    } else if (
        obj == 'OBJECT' && (schema == 'EMPTY' || schema == 'OBJECT')
    ) {
        return objectRecursion;
    }
}

function discard(obj: SomeObj, schema: SomeObj, key: string) {
    return schema;
}

function substitution(obj: SomeObj, schema: SomeObj, key: string) {
    return simpleType(resolveType(obj[key]), key, schema);
}

function arrayRecursion(obj: any[], schema: SomeObj, key: string) {
    const arraySchema = obj[key].reduce((accSchema, subObj) => resolveOperation(accSchema, subObj, key), {});
    return Object.assign(schema, arraySchema);
}

function objectRecursion(obj: SomeObj, schema: SomeObj, key: string) {
    const subObjectSchema = Object
        .entries(obj[key])
        // .reduce((accSchema, subObj) => ; // TODO: finish
    return Object.assign(schema)

}

function resolveOperation(schema: SomeObj, obj: any, key: string): SomeObj {
    const objNestedValue = obj[key];
    const schemaNestedValue = schema[key];
    const schemaArchType = resolveValueArchtype(schema[key]);
    const objArchType = resolveValueArchtype(objNestedValue);

    const strategy = resolveStrategy(objArchType, schemaArchType)

    // todo: all below is not correct
    switch (objArchType) {
        case 'EMPTY':
            return handleEmptyValue(schema, key);
        case 'SIMPLE':
            const type = resolveType(objNestedValue);
            return simpleType(type, key, schema);
        case 'ARRAY':
            return objNestedValue.length > 0
                ? Object.assign(schema, { [key]: [arrayOfObjectsToSchema(objNestedValue, {})] })
                : schema;
        case 'OBJECT':
            return Object.keys(objNestedValue).length > 0
                ? Object.assign(schema, { [key]: mapObjectToSchema(objNestedValue, {}) })
                : schema;
    }
}

function arrayOfObjectsToSchema(array: any[], schema: SomeObj = {}): SomeObj {
    return array.reduce(
        (acc, obj) => resolveValueArchtype(obj) == 'OBJECT'
            ? mapObjectToSchema(obj, acc)
            : JSON.stringify({ type: resolveType(obj).toLowerCase() }),
        schema
    );
}

function simpleType(type: string, key: string, schema: SomeObj) {
    return Object.assign(schema, { [key]: JSON.stringify({ type: type.toLowerCase() }) });
}

function unknownType(schema: SomeObj, key: string) {
    return Object.assign(schema, { [key]: JSON.stringify({ type: 'unknown' }) });
}

export { mapObjectToSchema };
