import R from 'ramda';
const _ = require('lodash');

import { Transform, SomeObj, TreeLeaf } from './types';

export function* generateTransform(transforms: Transform[]): Iterator<Transform> {
    for (const transform of transforms) {
        yield transform;
    }
}

export function applyToOneOrMany<P, A>(fn: (oneOrMany: P, args?: string | string[]) => A) {
    return function withFunction(oneOrMany: P | P[], args?: string | string[]): A | A[] {
        return Array.isArray(oneOrMany)
            ? (oneOrMany as P[]).flatMap(one => fn(one, args))
            : fn(oneOrMany as P, args)
    }
}

export function assignSchema(schema: SomeObj, key: string, value: any) {
    return Object.assign(schema, { [key]: value });
}

export function treeLeafsToTransforms(treeLeafs: TreeLeaf[]) {
    const transforms: Transform[] = treeLeafs.flatMap(
        ([path, targets]) => targets.map(target => ({ source: path, target }))
    )
    return transforms;
}

export function groupTransformsByTarget(transforms: Transform[]): SomeObj {
    return R.groupBy((transform: Transform) => transform.target.path)(transforms);
}

export function sortTransformsByPriority(transforms: Transform[]): Transform[] {
    return R.sort((ta: Transform, tb: Transform) => (ta.target?.priority ?? 1000) - (tb.target?.priority ?? 1000), transforms);
}

export function pruneEmpty<T extends SomeObj>(obj: T) {
    return function prune(current) {
        _.forOwn(current, function (value: any, key: string | number) {
            if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                (_.isString(value) && _.isEmpty(value)) ||
                (_.isObject(value) && !_.isDate(value) && _.isEmpty(prune(value)))) {
                delete current[key];
            }
        });
        // remove any leftover undefined values from the delete 
        // operation on an array
        if (_.isArray(current)) _.pull(current, undefined);
        return current;
    }(_.cloneDeep(obj));  // Do not modify the original object, create a clone instead
}
