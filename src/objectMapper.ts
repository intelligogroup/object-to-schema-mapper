import * as objectPath from 'object-path';
import * as R from 'ramda';
import { SomeObj, Transform } from './utils/types';
import { NestedOf } from './utils/objectManipulation';

function mapObject(originalObj: SomeObj, transformations: Transform[]) {
    const extractionPaths = transformations.map(el => el.source);
    const infoTree = buildTree(extractionPaths);
    const extractedValues = extractValues(originalObj, infoTree);
    return extractedValues;
}

function extractValues(object: SomeObj, infoTree: SomeObj): SomeObj {
    return Object
        .entries(infoTree)
        .reduce(
            (acc, [prefix, innerTree]) => {
                const info = objectPath.get(object, prefix);
                return ({
                    ...acc,
                    ...(innerTree ? extractValues(info, innerTree): info)
                })
            },
            {}
        )
}

function buildTree(extractionPaths: string[]): SomeObj {
    const { group: groupedPrefixes, leafs } = groupExtractionsByPath(extractionPaths);
    return Object
        .entries(groupedPrefixes)
        .reduce(
            (acc, [key, value]) => ({
                ...acc,
                ...{
                    [key]: buildTree(value.map(path => path.split(`${key}[].`)[1]))
                }
            }),
            leafs.reduce((acc, leaf) => ({ ...acc, ...{ [leaf]: null } }), {})
        );
}

function groupExtractionsByPath(extractionPaths: string[]): { group: SomeObj, leafs: string[] } {
    const [furtherProcessing, noProcessing] = R.partition(R.contains('[]'), extractionPaths);
    const groupByPrefix = R.groupBy((path: string) => path.split('[]')[0]);
    return {
        group: groupByPrefix(furtherProcessing),
        leafs: noProcessing
    }
}


const aa = {
    person: {
        names: ["maxim", "meir", "tzah"],
        taho: [
            { id: 1, test: [{ a:1, foo: 'f1' }, { a:2, foo: 'f2' }], nd: { test: 51 } },
            { id: 2, test: [{ a:3, foo: 'f3' }, { a:4, foo: 'f4' }], nd: { test: 52 } },
            { id: 3, test: [{ a:5, foo: 'f5' }, { a:6, foo: 'f6' }], nd: { test: 53 } }
        ]
    }
}


const a = mapObject(aa,
    [
        {
            source: "person.names",
            target: "person.names"
        },
        {
            source: "person.taho[].nd.test",
            target: "person.test"
        },
        {
            source: "person.taho[].id",
            target: "person.id"
        },
        {
            source: "person.taho[].test[].a",
            target: "person.test"
        },
        {
            source: "person.taho[].test[].foo",
            target: "person.id"
        }
    ]
)

console.log(JSON.stringify(a, null, 2));

