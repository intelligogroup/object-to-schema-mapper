import { SomeObj, ValType } from './types'

function resolveType(value: SomeObj): ValType {
    if (value == null) {
        return 'NULL';
    }
    else if (Array.isArray(value)) {
        return 'ARRAY';
    }
    else if (typeof value == 'string') {
        return 'STRING';
    }
    else if (typeof value == 'boolean') {
        return 'BOOLEAN';
    }
    else if (typeof value == 'object') {
        return 'OBJECT';
    }
    else if (
        Number.isInteger(value)
        || (!Number.isNaN(value) && Number.isInteger(Math.floor(value)))
    ) {
        return 'NUMBER';
    }
    return 'UNDEFINED';
}

export { resolveType };
