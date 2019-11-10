import * as objectPath from 'object-path';
import * as R from 'ramda';
import { SomeObj, Transform } from './utils/types';
import { unidotify, unUnidotify } from './utils/stringUtil';
import { unique } from './utils/objectUtil';

function mapObject(originalObj: SomeObj, transformations: Transform[]) {
    return createTargetObject(transformations, originalObj);
}

function createTargetObject(
    transformations: Transform[],
    originalObj: SomeObj,
    targetObject: SomeObj = {}
) {
    const extractionTree = buildTree(transformations);
    const [treeEntries, treeLeafs] = R.partition(isTargetValue(), Object.entries(extractionTree));

    treatLeavesMutation(originalObj, treeLeafs, targetObject);
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

function treatLeavesMutation(originalObj: SomeObj, treeLeafs: any[], targetObject: SomeObj) {
    treeLeafs.forEach(([source, mappingsArray]) => {
        mappingsArray.forEach(target => {
            const valueToSet = objectPath.get(originalObj, unUnidotify(source));
            if (target.includes('[]')) {
                objectPath.push(targetObject, target.split('[]')[0], valueToSet);
            } else {
                objectPath.set(targetObject, target, valueToSet);
            }
        });
    });
}

function getSubTransformations(transformations: Transform[], immediateSource: string) {
    const immediateTargets = transformations
        .filter(transform => transform.source.includes(immediateSource))
        .map(transform => {
            const sourceSplit = transform.source.split('[].')
            const targetSplit = transform.target.split('[].');
            const idxOfNesting = sourceSplit.indexOf(immediateSource);
            return {
                superTarget: targetSplit[idxOfNesting],
                innerTransformation: {
                    source: sourceSplit.slice(idxOfNesting + 1).join('[].'),
                    target: targetSplit.slice(idxOfNesting + 1).join('[].')
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


const aa = {
    person: {
        name: { fname: "FNAME", lname: "LNAME", mname: "MNAME" },
        pastPositions: ["a", "b", "c", "d"],
        addes: [{ street: "s1", house: "h1" }, { street: "s2", house: "h2" }],
        taho: [
            { id: 1, test: [{ a: 1, foo: 'f1' }, { a: 2, foo: 'f2' }], nd: { test: 51 } },
            { id: 2, test: [{ a: 3, foo: 'f3' }, { a: 4, foo: 'f4' }], nd: { test: 52 } },
            { id: 3, test: [{ a: 5, foo: 'f5' }, { a: 6, foo: 'f6' }], nd: { test: 53 } }
        ]
    }
}

const a = mapObject(aa,
    [
        {
            source: "person.name.fname",
            target: "names[]"
        },
        {
            source: "person.name.lname",
            target: "names[]"
        },
        {
            source: "person.pastPositions.0",
            target: "jobs.lastPosition"
        },
        {
            source: "person.addes[].street",
            target: "addresses[].streetAddress"
        },
        {
            source: "person.addes[].house",
            target: "addresses[].houseNumber"
        },
        {
            source: "person.taho[].id",
            target: "other[].transformedId"
        },
        {
            source: "person.taho[].test[].a",
            target: "some.time[].test[].p"
        },
        {
            source: "person.taho[].test[].foo",
            target: "some.time[].test[].no"
        }
    ]
)

console.log(JSON.stringify(a, null, 2));

