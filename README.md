# object-to-schema-mapper
Mapper that can go through a lot of response objects and sum all info into a schema

The configuration should be of the following general structure:
```
{
  "source": "<<sourceSchemaPath>>",
  "target": {
    "path": "<<targetSchemaPath>>"
    "<<optionalCondition>>": <<someValue>>
  }
}
```

The parameters `sourceSchemaPath` and `targetSchemaPath` are quite the same in structure:
- every nested json object should be expressed with the `.` symbol.
- every nested array should be abbreviated with `[]` symbol after the keyName.

One major rule should be preserved: The number of array-nested values extracted from the source object should be preserved in the target object.

## Examples:

1. for object:
```
{
  "person": {
    "addresses": [
      {
        "street": "foo street"
      },
     {
        "street": "bar street"
      }
    ]
  }
}
```
If there is only the need to extract the addresses array, WITHOUT changing the nested value names, the configuration will look like:
```
{
  "source": "person.addresses",
  "target": {
    "path": "somePerson.PersonAddresses"
  }
}
```

This will result in the following object:
```
{
  "somePerson": {
    "PersonAddresses": [
      {
        "street": "foo street"
      },
     {
        "street": "bar street"
      }
    ]
  }
}
```

If there's a need to alter each value inside an array, this will be expressed through the following configuration:
```
{
  "source": "person.addresses[].street",
  "target": {
    "path": "somePerson.PersonAddresses[].streetName"
  }
}
```

This configuration expresses that `addresses` in the source and `PersonAddresses` in the target are arrays in which there are nested values that should be mapped one to another: `street` to `streetName`.

As you can see, there is one level of `[]` nesting in `source` and `target`. This is the rule that should be preserved.

For reference: here's a complex object and possible mapping configurations that will be applied to It:

```
const aa = {
    person: {
        name: { mname: "MNAME" },
        dateOfBirth: "10/14/88",
        pastPositions: ["a", "b", "c", "d"],
        addes: [{ street: "s1", house: "h1" }, { street: "s2", house: "h2" }],
        addesB: [{ street: "wall street", house: "h1B" }, { street: "s2B", house: "h2B" }],
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
            target: {
                path: "names.first",
                defaultValue: "john",
            }
        },
        {
            source: "person.dateOfBirth",
            target: {
                path: "dob",
                predefinedTransformations: ['toDate']
            }
        },
        {
            source: "person.name.lname",
            target: {
                path: "names.last",
                conditionalValue: {
                    targetPathCondition: "names.first",
                    value: "doe"
                }
            }
        },
        {
            source: "person.pastPositions.0",
            target: {
                path: "jobs.lastPosition",
                predefinedTransformations: ["toUpperCase"]
            }
        },
        {
            source: "person.addes[].street",
            target: {
                path: "addresses[].streetAddress"
            }
        },
        {
            source: "person.addes[].house",
            target: {
                path: "addresses[].houseNumber"
            }
        },
        {
            source: "person.addesB[].house",
            target: {
                path: "addresses[].houseNumber"
            }
        },
        {
            source: "person.addesB[].street",
            target: {
                path: "addresses[].streetAddress",
                predefinedTransformations: ["titleCase"]
            }
        },
        {
            source: "person.taho[].id",
            target: {
                path: "other[].transformedId"
            }
        },
        {
            source: "person.taho[].test[].a",
            target: {
                path: "some.time[].test[].p"
            }
        },
        {
            source: "person.taho[].test[].foo",
            target: {
                path: "some.time[].test[].no"
            }
        }
    ]
)
```
