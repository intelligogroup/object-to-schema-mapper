import objectPath from 'object-path';
import R from 'ramda';

import { SomeObj, Transform, TreeLeaf, } from './utils/types';
import { unidotify, unUnidotify } from './utils/stringUtil';
import { unique, identity } from './utils/generalUtil';
import { postProcessCreatedObject } from './postProcessing';
import {
    generateTransform,
    treeLeafsToTransforms,
    groupTransformsByTarget,
    sortTransformsByPriority,
    pruneEmpty,
} from './utils/transform';

function mapObject(originalObj: SomeObj, transformations: Transform[]) {
    if (!transformations || transformations.length == 0) {
        return {};
    }
    const initialObject = createTargetObject(transformations, originalObj);
    const postProcessedObject = postProcessCreatedObject(initialObject, transformations);
    return pruneEmpty(postProcessedObject);
}

function createTargetObject(
    transformations: Transform[],
    originalObj: SomeObj,
    targetObject: SomeObj = {}
) {
    const extractionTree = buildTree(transformations);
    const [treeEntries, treeLeafs] = R.partition(isTargetValue(), Object.entries(extractionTree));

    treatLeafsMutation(originalObj, treeLeafs, targetObject);
    treatTreeMutation(originalObj, treeEntries, transformations, targetObject);

    return targetObject;
}

function treatTreeMutation(originalObj: SomeObj, treeEntries: any[], transformations: Transform[], targetObject: SomeObj) {
    treeEntries.forEach(([source, _]) => {

        const arrayValuesToSet = objectPath.get(originalObj, source);
        const nextTargets = getSubTransformations(transformations, source);
        nextTargets.forEach(({ superTarget, transforms }) => {

            arrayValuesToSet.forEach(originalSubObj => {

                objectPath.push(targetObject, superTarget, createTargetObject(transforms, originalSubObj));
            });
        });
    });
}

const strategies = {
    predefinedTransformations: {
        toUpperCase: (str: string) => str.toUpperCase(),
        toLowerCase: (str: string) => str.toLowerCase(),
        titleCase: (str: string) => str
            .split(/\s/)
            .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
            .join(' '),
        toDate: (string: string) => new Date(string),
    }
}

function chooseHighestPriorityTransform(originalObj: SomeObj) {
    return function withObject(transforms: Transform[]): Transform | null {
        const transformGenerator = generateTransform(transforms);
        let transform = transformGenerator.next()
        while (!transform.done && !objectPath.has(originalObj, unUnidotify(transform.value.source)) && !transform.value.target.defaultValue) {
            transform = transformGenerator.next();
        }
        return transform.done ? null : transform.value;
    }
}

function transformsToTreeLeafs(transforms: Transform[]): TreeLeaf[] {
    const grouped: { [path: string]: Transform[] } = R.groupBy((transform: Transform) => transform.source, transforms);
    return Object
        .entries(grouped)
        .map(([path, transforms]) => [path, transforms.map(transform => transform.target)])
}

function eliminateLowPriority(originalObj: SomeObj, treeLeafs: TreeLeaf[]): TreeLeaf[] {
    const transforms = treeLeafsToTransforms(treeLeafs);
    const tranformsByTarget = groupTransformsByTarget(transforms);
    const highestPriorityTransforms = Object
        .entries(tranformsByTarget)
        .map(([path, transforms]) => [
            path,
            chooseHighestPriorityTransform(originalObj)(sortTransformsByPriority(transforms))
        ])
        .filter(([_, transforms]) => transforms != null)
        .map(([_, transform]) => transform)
    const priorityTreeLeafs = transformsToTreeLeafs(highestPriorityTransforms as Transform[]);
    return priorityTreeLeafs;
}

function treatLeafsMutation(originalObj: SomeObj, treeLeafs: TreeLeaf[], targetObject: SomeObj) {
    const priorityTreeLeafs = eliminateLowPriority(originalObj, treeLeafs);
    priorityTreeLeafs.forEach(([source, mappingsArray]) => {
        mappingsArray.forEach(target => {
            let valueToSet = objectPath.get(originalObj, unUnidotify(source)) || target.defaultValue || null;
            if (target.predefinedTransformations) {
                valueToSet = target
                    .predefinedTransformations
                    .reduce(
                        (finalValue, transformationName) =>
                            (strategies.predefinedTransformations[transformationName] || identity)(finalValue),
                        valueToSet
                    );
            }
            if (target.path.includes('[]')) {
                objectPath.push(targetObject, target.path.split('[]')[0], valueToSet);
            } else {
                objectPath.set(targetObject, target.path, valueToSet);
            }
        });
    });
}

function getSubTransformations(transformations: Transform[], immediateSource: string) {
    const immediateTargets = transformations
        .filter(transform => transform.source.split('[].')[0] == immediateSource)
        .map(transform => {
            const sourceSplit = transform.source.split('[].')
            const targetSplit = transform.target.path.split('[].');
            const idxOfNesting = sourceSplit.indexOf(immediateSource);
            return {
                superTarget: targetSplit[idxOfNesting],
                innerTransformation: {
                    source: sourceSplit.slice(idxOfNesting + 1).join('[].'),
                    target: {
                        ...transform.target,
                        path: targetSplit.slice(idxOfNesting + 1).join('[].'),
                    }
                }
            };
        })
        .filter(unique);

    const groupedTransforms = R.groupBy(target => target.superTarget, immediateTargets);
    return Object
        .entries(groupedTransforms)
        .map(([superTarget, value]) => ({
            superTarget,
            transforms: value.map(el => el.innerTransformation)
        }));
}

function isTargetValue() {
    return ([_, value]) => !Array.isArray(value);
}

function buildTree(transformations: Transform[]): SomeObj {
    const { group: groupedTransforms, leafs: leafTransforms } = groupExtractionsByPath(transformations);
    return Object
        .entries(groupedTransforms)
        .reduce(
            (acc, [key, value]) => ({
                ...acc,
                ...{
                    [key]: buildTree(
                        value.map(transform => ({
                            source: transform.source.split(`${key}[].`)[1],
                            target: transform.target
                        }))
                    )
                }
            }),
            leafTransforms.reduce(
                (acc, leaf) => {
                    objectPath.push(acc, unidotify(leaf.source), leaf.target);
                    return acc;
                },
                {}
            )
        );
}

function groupExtractionsByPath(transformations: Transform[]): { group: SomeObj, leafs: Transform[] } {
    const [furtherProcessing, noProcessing] = R.partition(transform => transform.source.includes('[]'), transformations);
    return {
        group: groupBySourcePrefix()(furtherProcessing),
        leafs: noProcessing
    }
}

function groupBySourcePrefix() {
    return R.groupBy((transform: Transform) => transform.source.split('[]')[0]);
}

export { mapObject }
