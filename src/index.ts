import { mapObject } from './mapper';
import { mapObjectToSchema } from './schemaCreator';
import { extractExampleFromSchema } from './exampleRecordExtractor';

export {
    mapObject,
    mapObjectToSchema,
    extractExampleFromSchema,
}

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
