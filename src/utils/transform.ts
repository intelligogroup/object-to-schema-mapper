import R from 'ramda';

import { Transform, SomeObj, TreeLeaf } from './types';

export function* generateTransform(transforms: Transform[]): Iterator<Transform> {
    for (const transform of transforms) {
        yield transform;
    }
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
