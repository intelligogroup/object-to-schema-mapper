type SomeObj = { [key: string]: any }

type InstructionStrategies = {
    [key: string]: (object: SomeObj, instruction) => SomeObj;
}

type PredefinedTransformation = 'toUpperCase'
    | 'toLowerCase'
    | 'titleCase'
    | 'toDate'

type Transform = {
    source: string,
    target: {
        path: string,
        defaultValue?: any,
        conditionalValue?: {
            targetPathCondition: string,
            value: any
        }
        predefinedTransformations?: PredefinedTransformation[]
    }
}

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
    InstructionStrategies,
    ValType,
    ValArchtype
};
