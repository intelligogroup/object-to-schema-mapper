type SomeObj = { [key: string]: any }
type ValType = 'ARRAY'
| 'STRING'
| 'BOOLEAN'
| 'OBJECT'
| 'NULL'
| 'NUMBER'
| 'UNDEFINED'

type ValArchtype = 'SIMPLE'
    | 'EMPTY'
    | 'ARRAY'
    | 'OBJECT'

export { SomeObj, ValType, ValArchtype };