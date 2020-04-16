import R from 'ramda';

import { SomeObj } from './utils/types';
import { resolveValueArchtype, resolveType } from './utils/generalUtil';
import { assignSchema } from './utils/transform';
import _ = require('lodash')

function mapObjectToSchema(obj: SomeObj, schema: SomeObj = {}): SomeObj {
    if (!obj) {
        return {};
    }

    return Object
        .keys(pruneEmpty(obj))
        .reduce(
            (schema, key) => resolveOperation(schema, obj, key),
            schema
        );
}

function resolveOperation(schema: SomeObj, obj: any, key: string): SomeObj {
    const nestedValue = obj[key];
    const archType = resolveValueArchtype(nestedValue);
    switch (archType) {
        case 'EMPTY':
            return assignSchema(schema, key, handleEmptyValue(schema, key));
        case 'SIMPLE':
            const type = resolveType(nestedValue);
            return assignSchema(schema, key, simpleType(type, nestedValue));
        case 'ARRAY':
            const schemaValue = schema[key];
            return assignSchema(schema, key, handleArrayValues(nestedValue, schemaValue));
        case 'OBJECT':
            return assignSchema(schema, key, handleObjectValues(nestedValue, schema, key));
    }
}

function pruneEmpty(obj) {

    return function prune(current) {
        _.forOwn(current, function (value, key) {
            if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                (_.isString(value) && _.isEmpty(value)) ||
                (_.isObject(value) && _.isEmpty(prune(value)))) {

                delete current[key];
            }
        });
        // remove any leftover undefined values from the delete 
        // operation on an array
        if (_.isArray(current)) _.pull(current, undefined);

        return current;

    }(_.cloneDeep(obj));  // Do not modify the original object, create a clone instead
}


function handleEmptyValue(schema: SomeObj, key: string) {
    const value = schema[key];
    return value == null || value.includes('unknown')
        ? unknownType()
        : schema;
}

function handleObjectValues(nestedValue: SomeObj, schema: SomeObj, key: string) {
    if (schema[key]) {
        const mergedSchema = mapObjectToSchema(nestedValue, schema[key]);
        return mergedSchema;
    } else {
        return mapObjectToSchema(nestedValue);
    }
}

function handleArrayValues(nestedValue: any[], schemaValue: any[]) {
    if (resolveValueArchtype(nestedValue[0]) == 'OBJECT') {
        const arraySchema = nestedValue.reduce(
            (accSchema, obj) => mapObjectToSchema(obj, accSchema),
            schemaValue ? schemaValue[0] : {}
        );
        return [arraySchema];
    } else {
        const type = resolveType(nestedValue);
        return [
            JSON.stringify({
                type: type.toLowerCase(),
                example: generateExample(nestedValue[0])
            })
        ];
    }
}

function simpleType(type: string, value: any) {
    return JSON.stringify({ type: type.toLowerCase(), example: generateExample(value) });
}

function unknownType() {
    return JSON.stringify({ type: 'unknown' });
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
