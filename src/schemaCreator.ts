import { SomeObj, ValArchtype } from './utils/types';
import { resolveValueArchtype, resolveType } from './utils/generalUtil';

function mapObjectToSchema(obj: SomeObj, schema: SomeObj = {}): SomeObj {
    return Object
        .entries(obj)
        .reduce(
            (accSchema, [key, value]) => Object.assign(accSchema, { [key]: resolveOperation(schema[key], value) }),
            schema
        );
}

function resolveOperation(schema: SomeObj = {}, obj: any): SomeObj {
    const schemaArchType = resolveValueArchtype(schema);
    const objArchType = resolveValueArchtype(obj);

    const strategy = resolveStrategy(objArchType, schemaArchType);
    return strategy(obj, schema);
}

function resolveStrategy(obj: ValArchtype, schema: ValArchtype): Function {
    if (obj == 'SIMPLE') {
        return substitution;

    } else if (obj == 'ARRAY') {
        return arrayRecursion;

    } else if (obj == 'EMPTY' && schema == 'EMPTY') {
        return unknownType;

    } else if (obj == 'EMPTY') {
        return discard;

    } else if (obj == 'OBJECT') {
        return mapObjectToSchema;

    } else {
        return unknownType;
    }
}

function arrayRecursion(obj: any[], schema: SomeObj = {}): any[] {
    const arraySchema = obj.reduce((accSchema, subObj) => resolveOperation(Array.isArray(accSchema) ? accSchema[0] : accSchema, subObj), schema);
    return Array.isArray(arraySchema) ? arraySchema : [arraySchema];
}

function discard(obj: SomeObj, schema: SomeObj) {
    return schema;
}

function substitution(obj: SomeObj, schema: SomeObj) {
    return JSON.stringify({ type: resolveType(obj).toLowerCase() });
}

function unknownType(obj: SomeObj, schema: SomeObj) {
    return JSON.stringify({ type: 'unknown' });
}

export { mapObjectToSchema };
