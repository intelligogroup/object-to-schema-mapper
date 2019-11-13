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

Examples:

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
