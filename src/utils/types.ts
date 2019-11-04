type SomeObj = { [key: string]: any }

type Transform = { source: string, target: string }

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

export {
    SomeObj,
    Transform,
    ValType,
    ValArchtype
};