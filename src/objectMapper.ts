import * as objectPath from 'object-path';
import { SomeObj, Transform } from './utils/types';
import { NestedOf } from './utils/dataExtraction';

function mapObject(originalObj: SomeObj, transformations: Transform[]) {
    return transformations.reduce(
        (mappedObject, transformation) => transform(originalObj, transformation, mappedObject),
        Object.create(null, {})
    );
}

function transform(object: SomeObj, transform: Transform, mappedObject: SomeObj) {
    const valueFromSource = extractValue(object, transform.source);
    return addToObject(mappedObject, valueFromSource, transform.target)
}

function addToObject(targetObject: SomeObj, valueToAdd: any, target: string) {
    objectPath.set(targetObject, target, valueToAdd);
    return targetObject;
}

function extractValue(object: SomeObj, path: string) {
    const value = path
        .split('.')
        .reduce(
            ({ root, isInArray }, currPath) => {
                const arrayCheck = currPath.split('[]');

                if (isInArray) {
                    root.inArray([arrayCheck[0]]);
                } else {
                    root.inPath([arrayCheck[0]]);
                }

                return arrayCheck.length > 1
                    ? { root: root.inArray(), isInArray: true }
                    : { root, isInArray };
            },
            { root: NestedOf(object), isInArray: false }
        );
    return value.root.get();
}

const a = mapObject(
    {
        person: {
            names: ["maxim", "meir", "tzah"],
            taho: [
                { id: 1, test: 't1' },
                { id: 2, test: 't2' },
                { id: 3, test: 't3' }
            ]
        }
    },
    [
        {
            source: "person.taho[].id",
            target: "ids[]._id"
        },
        {
            source: "person.taho[].test",
            target: "ids[]._test"
        },
        {
            source: "person.names.0",
            target: "name"
        }
    ]
)

console.log(JSON.stringify(a, null, 2));

// const a = NestedOf({ a: { taho: [{ a: 1 }, { a: 2 }, { a: 3 }] } }).inPath(['a']).inPath(['taho']).inArray()
// console.log(a.get())
