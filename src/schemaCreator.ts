import { SomeObj } from './utils/types';
import { resolveValueArchtype, resolveType } from './utils/generalUtil';

function mapObjectToSchema(obj: SomeObj, schema: SomeObj = {}): SomeObj {
    return obj
        ? Object
            .keys(obj)
            .reduce(
                (schema, key) => resolveOperation(schema, obj, key),
                schema
            )
        : {};
}

function handleEmptyValue(schema: SomeObj, key: string) {
    const value = schema[key];
    if (value == null || value == 'unknown') {
        return unknownType(schema, key);
    }
    return schema;
}

function resolveOperation(schema: SomeObj, obj: any, key: string): SomeObj {
    const nestedValue = obj[key];
    const archType = resolveValueArchtype(nestedValue);
    switch (archType) {
        case 'EMPTY':
            return handleEmptyValue(schema, key);
        case 'SIMPLE':
            const type = resolveType(nestedValue);
            return simpleType(type, key, schema, nestedValue);
        case 'ARRAY':
            return Object.assign(schema, { [key]: [arrayOfObjectsToSchema(nestedValue, {})] });
        case 'OBJECT':
            return Object.assign(schema, { [key]: mapObjectToSchema(nestedValue, {}) });
    }
}

function arrayOfObjectsToSchema(array: [any], schema: SomeObj = {}): SomeObj {
    return array.reduce(
        (acc, obj) => resolveValueArchtype(obj) == 'OBJECT'
            ? mapObjectToSchema(obj, acc)
            : JSON.stringify({ type: resolveType(obj).toLowerCase(), example: obj }),
        schema
    );
}

function simpleType(type: string, key: string, schema: SomeObj, value: any) {
    return Object.assign(schema, { [key]: JSON.stringify({ type: type.toLowerCase(), example: value }) });
}

function unknownType(schema: SomeObj, key: string) {
    return Object.assign(schema, { [key]: JSON.stringify({ type: 'unknown' }) });
}

export { mapObjectToSchema };
