import { SomeObj } from './utils/types';
import { resolveType } from './utils/objectUtil';

function mapObjectToSchema(obj: SomeObj, schema: SomeObj = {}): SomeObj {
    return Object
        .keys(obj)
        .reduce(
            (schema, key) => {
                const type = resolveType(obj[key]);
                switch (type) {
                    case 'UNDEFINED':
                    case 'NULL':
                        return handleEmptyValue(schema, key);
                    case 'STRING':
                    case 'NUMBER':
                    case 'BOOLEAN':
                        return simpleType(type, schema, key);
                    case 'ARRAY':
                        return Object.assign(schema, { [key]: [arrayOfObjectsToSchema(obj[key], {})] });
                    case 'OBJECT':
                        return Object.assign(schema, { [key]: mapObjectToSchema(obj[key], {}) });
                }
            },
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

function arrayOfObjectsToSchema(objArray: [SomeObj], schema: SomeObj): SomeObj {
    return objArray.reduce((acc, obj) => mapObjectToSchema(obj, acc), schema);
}

function simpleType(type: string, schema: SomeObj, key: string) {
    return Object.assign(schema, { [key]: JSON.stringify({ type: type.toLowerCase() }) });
}

function unknownType(schema: SomeObj, key: string) {
    return Object.assign(schema, { [key]: 'unknown type' });
}

export { mapObjectToSchema };
