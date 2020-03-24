import R from 'ramda';

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
            const schemaValue = schema[key];
            if (resolveValueArchtype(nestedValue[0]) == 'OBJECT') {
                const arraySchema = nestedValue.reduce(
                    (accSchema, obj) => mapObjectToSchema(obj, accSchema),
                    schemaValue ? schemaValue[0] : {}
                );
                return Object.assign(schema, { [key]: [arraySchema] })
            } else {
                const type = resolveType(nestedValue);
                return Object.assign(schema, { [key]: [JSON.stringify({ type: type.toLowerCase(), example: generateExample(nestedValue[0]) })] });
            }
        case 'OBJECT':
            return R.mergeDeepLeft(schema, { [key]: mapObjectToSchema(nestedValue) });
    }
}

function simpleType(type: string, key: string, schema: SomeObj, value: any) {
    return Object.assign(schema, { [key]: JSON.stringify({ type: type.toLowerCase(), example: generateExample(value) }) });
}

function unknownType(schema: SomeObj, key: string) {
    // if (schema[key] == null || (typeof schema[key] == 'string' &&)
    return Object.assign(schema, { [key]: JSON.stringify({ type: 'unknown' }) });
}

function generateExample(value: string | number | boolean) {
    if (typeof value == 'string') {
        return R.tryCatch(
            () => {
                const json = JSON.parse(value);
                return json.example && json.type ? json.example : value;
            },
            () => value
        )()
    } else {
        return value;
    }
}

export { mapObjectToSchema };
