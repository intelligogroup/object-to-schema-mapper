import objectPath from 'object-path';
import R from 'ramda';
import { ITarget } from './utils/types';
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
import { strategies } from './utils/predefinedTransformations';

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

        if (!arrayValuesToSet) {
            return
        }

        const nextTargets = getSubTransformations(transformations, source);
        nextTargets.forEach(({ superTarget, transforms }) => {

            arrayValuesToSet.forEach(originalSubObj => {

                objectPath.push(targetObject, superTarget, createTargetObject(transforms, originalSubObj));
            });
        });
    });
}

function chooseHighestPriorityTransforms(originalObj: SomeObj) {
    return function withObject(transforms: Transform[]): Transform[] {
        if (transforms.every(transform => transform.target.path.includes('[]'))) {
            return transforms;
        }

        const transformGenerator = generateTransform(transforms);
        let transform = transformGenerator.next();
        let valueToSet = objectPath.get(originalObj, unUnidotify(transform.value.source)) || transform.value.target.defaultValue || null;

        while (
            !transform.done
            && !(objectPath.has(originalObj, unUnidotify(transform.value.source))
                && (!transform.value.target.predefinedTransformations?.length
                    || getValueAfterTransformations(transform.value.target, valueToSet)))
            && !transform.value.target.defaultValue
        ) {
            
            transform = transformGenerator.next();
            
            if (transform.done) {
                continue;
            }

            valueToSet = objectPath.get(originalObj, unUnidotify(transform.value.source)) || transform.value.target.defaultValue || null;
        }
        return transform.done ? [] : [transform.value];
    }
}

function transformsToTreeLeafs(transforms: Transform[]): TreeLeaf[] {
    const grouped = R.groupBy((transform: Transform) => transform.source, transforms) as Partial<Record<string, Transform[]>>;

    return Object
        .entries(grouped)
        .map(([path, transforms]) => [path, (transforms ?? []).map(transform => transform.target)]);
}

function eliminateLowPriority(originalObj: SomeObj, treeLeafs: TreeLeaf[]): TreeLeaf[] {
    const transforms = treeLeafsToTransforms(treeLeafs);
    const tranformsByTarget = groupTransformsByTarget(transforms);
    const highestPriorityTransforms = Object
        .entries(tranformsByTarget)
        .map(([path, transforms]) => [
            path,
            chooseHighestPriorityTransforms(originalObj)(sortTransformsByPriority(transforms))
        ])
        .filter(([_, transforms]) => (transforms as Transform[]).length)
        .flatMap(([_, transforms]) => (transforms as Transform[]).map(identity));
    const priorityTreeLeafs = transformsToTreeLeafs(highestPriorityTransforms as Transform[]);
    return priorityTreeLeafs;
}

function getValueAfterTransformations(target: ITarget, valueToSet: SomeObj) {
    return target?.predefinedTransformations
        ?.reduceRight(
            (finalValue, predefinedTransformation) => {
                const transformationName = predefinedTransformation?.transformation;
                const transformationArgs = predefinedTransformation?.transformationArgs;
                const options = predefinedTransformation?.options;

                return (strategies.predefinedTransformations[transformationName] ?? identity)(finalValue, transformationArgs || options);
            },
            valueToSet
        );
}

function treatLeafsMutation(originalObj: SomeObj, treeLeafs: TreeLeaf[], targetObject: SomeObj) {
    const priorityTreeLeafs = eliminateLowPriority(originalObj, treeLeafs);
    priorityTreeLeafs.forEach(([source, mappingsArray]) => {
        mappingsArray.forEach(target => {
            const value = objectPath.get(originalObj, unUnidotify(source));
            let valueToSet = value === 0 ? value : (value || target.defaultValue || null);
            if (target.predefinedTransformations) {
                valueToSet = getValueAfterTransformations(target, valueToSet)
            }
            if (target.path.includes('[]')) {
                const splitTargetByArray = target.path.split('[]');
                const valueToPush = R.isEmpty(splitTargetByArray[1])
                    ? valueToSet
                    : { [splitTargetByArray[1].slice(1)]: valueToSet };
                objectPath.push(targetObject, splitTargetByArray[0], valueToPush);
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
            transforms: value!.map(el => el.innerTransformation)
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
