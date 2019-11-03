import { ValType, ValArchtype } from './types'

function resolveValueArchtype(value: any): ValArchtype {
    const type = resolveType(value);
    switch (type) {
        case 'NULL':
        case 'UNDEFINED':
            return 'EMPTY';
        case 'NUMBER':
        case 'BOOLEAN':
        case 'STRING':
            return 'SIMPLE';
        default:
            return type;
    }
}

function resolveType(value: any): ValType {
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

export { resolveType, resolveValueArchtype };
