import * as objectPath from 'object-path';
import * as R from 'ramda';
import { SomeObj, Transform } from './utils/types';
import { unidotify, unUnidotify } from './utils/stringUtil';
import { unique, identity } from './utils/generalUtil';
import { postProcessCreatedObject } from './postProcessing';

function mapObject(originalObj: SomeObj, transformations: Transform[]) {
    const initialObject = createTargetObject(transformations, originalObj);
    const postProcessedObject = postProcessCreatedObject(initialObject, transformations);
    return postProcessedObject;
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

function treatLeafsMutation(originalObj: SomeObj, treeLeafs: any[], targetObject: SomeObj) {
    treeLeafs.forEach(([source, mappingsArray]) => {
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
