import * as objectPath from 'object-path';
import * as R from 'ramda';
import { SomeObj, Transform } from './utils/types';
import { NestedOf } from './utils/objectManipulation';

function mapObject(originalObj: SomeObj, transformations: Transform[]) {
    const extractionPaths = transformations.map(el => el.source);
    const groupedExtractions = groupExtractionsByPath(extractionPaths);
    const rephrasedValues = rephraseSyntax(groupedExtractions);
    const extractedValues = rephrasedValues.map(rephrased => extractValue(originalObj, rephrased))
    return extractedValues;
    // const valuesCache = extractValuesToMap(extractionPaths);
    return transformations.reduce(
        (mappedObject, transformation) => transform(originalObj, transformation, mappedObject),
        Object.create({})
    );
}

function rephraseSyntax(groupedExtractions: SomeObj) {
    return Object
        .keys(groupedExtractions)
        .map(key => groupedExtractions[key]
            .reduce(
                (acc, element) => ({ prefix: acc.prefix, several: [element.split('[].')[1], ...acc.several] }),
                { prefix: key, several: [] }
            )
        )
        .map(el => `${el.prefix}[].{${el.several.join(',')}}`)
}

// function extractValuesToMap(extractionPaths: string[]) {
//     return new Map(extractionPaths.map(path => [path, extractValue({}, path)]));
// }

// TODO: currently supports only one level of nesting
function groupExtractionsByPath(extractionPaths: string[]): SomeObj {
    const arrayedParams = extractionPaths.filter(path => path.includes('[]'));
    const groupByPrefix = R.groupBy((path: string) => path.split('[]')[0]);
    return groupByPrefix(arrayedParams)
}

function transform(object: SomeObj, transform: Transform, mappedObject: SomeObj) {
    const valueFromSource = extractValue(object, transform.source);
    return addToObject(mappedObject, valueFromSource, transform.target);
}

function addToObject(targetObject: SomeObj, valueToAdd: any, target: string) {
    const newObject = setValue(targetObject, target.split('.'), valueToAdd, targetObject);
    return newObject;
}

function extractValue(object: SomeObj, path: string) {
    const value = path
        .split('.')
        .reduce(
            ({ root, isInArray }, currPath) => {
                const purePath = currPath.split('[]');

                if (isInArray) {
                    const several = /^{(.*)}$/.exec(purePath[0]);
                    if (several) {
                        // root.inArray([purePath[0]]);
                        root.several([several[1].split(',')]);
                    } else {
                        root.inArray([purePath[0]]);
                    }
                } else {
                    root.inPath([purePath[0]]);
                }

                return purePath.length > 1
                    ? { root: root.inArray(), isInArray: true }
                    : { root, isInArray };
            },
            { root: NestedOf(object), isInArray: false }
        );
    return value.root.get();
}

function setValue(object: SomeObj, path: string[], value: any, originalObj: SomeObj): SomeObj {
    const [key, ...restPath] = path;
    // const isArray = key.includes('[]');
    const pureKey = key.split('[]')[0];

    if (restPath.length == 0) {
        object[pureKey] = value;
        return originalObj;
        // return Object.getOwnPropertyNames(originalObj).length > 0
        //     ? originalObj
        //     : object;
    }

    if (!object[pureKey]) {
        object[pureKey] = {};
    }

    // if (isArray) {
    //     object[pureKey] = value.map(element => setValue({}, restPath, element, object[pureKey]));
    //     return object;
    // } else {
    return setValue(object[pureKey], restPath, value, originalObj);
    // }
}


const aa = {
    person: {
        names: ["maxim", "meir", "tzah"],
        taho: [
            { id: 1, test: 't1', notNeeded: { test: 51 } },
            { id: 2, test: 't2', notNeeded: { test: 52 } },
            { id: 3, test: 't3', notNeeded: { test: 53 } }
        ]
    }
}

// const a = NestedOf(aa)
//     .inPath(['person'])
//     .inPath(['taho'])
//     .inArray()
//     .several([['id'], ['notNeeded.test']])
//     .get()


const a = mapObject(aa,
    [
        {
            source: "person.taho[].notNeeded",
            target: "person.test"
        },
        {
            source: "person.taho[].id",
            target: "person.id"
        }
    ]
)

// const b = {
//     person: {
//         taho: [
//             {
//                 version: {
//                     _id: 1
//                 },
//                 _test: 't1'
//             },
//             {
//                 version: {
//                     _id: 2
//                 },
//                 _test: 't2'
//             },
//             {
//                 version: {
//                     _id: 3
//                 },
//                 _test: 't3'
//             },
//         ]
//     }
// }

console.log(JSON.stringify(a, null, 2));

// const a = NestedOf({ a: { taho: [{ a: 1 }, { a: 2 }, { a: 3 }] } }).inPath(['a']).inPath(['taho']).inArray()
// console.log(a.get())
