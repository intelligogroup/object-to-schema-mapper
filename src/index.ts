import { mapObject } from './mapper';
import { mapObjectToSchema } from './schemaCreator';
import { extractExampleFromSchema } from './exampleRecordExtractor';

export {
    mapObject,
    mapObjectToSchema,
    extractExampleFromSchema,
}

// const aa = {
//     person: {
//         name: { mname: "MNAME" },
//         dateOfBirth: "10/14/88",
//         pastPositions: ["a", "b", "c", "d"],
//         addes: [{ street: "s1", house: "h1" }, { street: "s2", house: "h2" }],
//         addesB: [{ street: "wall street", house: "h1B" }, { street: "s2B", house: "h2B" }],
//         taho: [
//             { id: 1, test: [{ a: 1, foo: 'f1' }, { a: 2, foo: 'f2' }], nd: { test: 51 } },
//             { id: 2, test: [{ a: 3, foo: 'f3' }, { a: 4, foo: 'f4' }], nd: { test: 52 } },
//             { id: 3, test: [{ a: 5, foo: 'f5' }, { a: 6, foo: 'f6' }], nd: { test: 53 } }
//         ]
//     }
// }

// const a = mapObject(aa,
//     [
//         {
//             source: "person.name.fname",
//             target: {
//                 path: "names.first",
//                 defaultValue: "john",
//             }
//         },
//         {
//             source: "person.dateOfBirth",
//             target: {
//                 path: "dob",
//                 predefinedTransformations: ['toDate']
//             }
//         },
//         {
//             source: "person.name.lname",
//             target: {
//                 path: "names.last",
//                 conditionalValue: {
//                     targetPathCondition: "names.first",
//                     value: "doe"
//                 }
//             }
//         },
//         {
//             source: "person.pastPositions.0",
//             target: {
//                 path: "jobs.lastPosition",
//                 predefinedTransformations: ["toUpperCase"]
//             }
//         },
//         {
//             source: "person.addes[].street",
//             target: {
//                 path: "addresses[].streetAddress"
//             }
//         },
//         {
//             source: "person.addes[].house",
//             target: {
//                 path: "addresses[].houseNumber"
//             }
//         },
//         {
//             source: "person.addesB[].house",
//             target: {
//                 path: "addresses[].houseNumber"
//             }
//         },
//         {
//             source: "person.addesB[].street",
//             target: {
//                 path: "addresses[].streetAddress",
//                 predefinedTransformations: ["titleCase"]
//             }
//         },
//         {
//             source: "person.taho[].id",
//             target: {
//                 path: "other[].transformedId"
//             }
//         },
//         {
//             source: "person.taho[].test[].a",
//             target: {
//                 path: "some.time[].test[].p"
//             }
//         },
//         {
//             source: "person.taho[].test[].foo",
//             target: {
//                 path: "some.time[].test[].no"
//             }
//         }
//     ]
// )

// console.log(JSON.stringify(a, null, 2));
