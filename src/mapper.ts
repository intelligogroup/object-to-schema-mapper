import { SomeObj, ValArchtype } from './utils/types';
import { resolveValueArchtype, resolveType } from './utils/objectUtil';

function mapObjectToSchema(obj: SomeObj, schema: SomeObj = {}): SomeObj {
    return Object
        .keys(obj)
        .reduce(
            (schema, key) => resolveOperation(schema, obj, key, resolveValueArchtype(obj[key])),
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

function resolveOperation(schema: SomeObj, obj: any, key: string, archType: ValArchtype): SomeObj {
    switch (archType) {
        case 'EMPTY':
            return handleEmptyValue(schema, key);
        case 'SIMPLE':
            return simpleType(resolveType(obj[key]), schema, key);
        case 'ARRAY':
            return Object.assign(schema, { [key]: [arrayOfObjectsToSchema(obj[key], {})] });
        case 'OBJECT':
            return Object.assign(schema, { [key]: mapObjectToSchema(obj[key], {}) });
    }
}

function arrayOfObjectsToSchema(objArray: [any], schema: SomeObj): SomeObj {
    return objArray.reduce(
        (acc, obj) => {
            const archType = resolveValueArchtype(obj);
            switch (archType) {
                case 'SIMPLE':
                case 'EMPTY':
                    return JSON.stringify({ type: resolveType(obj) });
                case 'OBJECT':
                    return mapObjectToSchema(obj, acc);
                case 'ARRAY':
                    return [arrayOfObjectsToSchema(obj, schema)]
            }
        },
        schema
    );
}

function simpleType(type: string, schema: SomeObj, key: string) {
    return Object.assign(schema, { [key]: JSON.stringify({ type: type.toLowerCase() }) });
}

function unknownType(schema: SomeObj, key: string) {
    return Object.assign(schema, { [key]: 'unknown type' });
}

export { mapObjectToSchema };
