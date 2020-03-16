import R from 'ramda';

import { SomeObj } from './utils/types';

export function extractExampleFromSchema(schemaWithExamples: SomeObj): SomeObj {
    return Object
        .entries(schemaWithExamples)
        .reduce(
            (example, [key, value]) => R.mergeDeepLeft(example, { [key]: cases(value) }),
            {}
        );
}

function cases(value: string | SomeObj | any[]) {
    if (typeof value == 'string') {
        return JSON.parse(value)?.example ?? typeToRandomData(JSON.parse(value)?.type ?? '');
    } else if (Array.isArray(value)) {
        return typeof value[0] == 'string'
            ? [
                JSON.parse(value[0])?.example
                ?? typeToRandomData(JSON.parse(value[0])?.type ?? '')
            ]
            : [extractExampleFromSchema(value[0] ?? {})];
    } else if (({}).constructor === value.constructor) {
        return extractExampleFromSchema(value);
    } else {
        return {};
    }
}

function typeToRandomData(type: 'string' | 'number') {
    switch (type) {
        case 'string':
            return 'some string';
        case 'number':
            return 1234;
        default:
            return 'unknown type and data'
    }
}
