type SomeObj = { [key: string]: any }

type InstructionStrategies = {
    [key: string]: (object: SomeObj, instruction) => SomeObj;
}

interface PredefinedTransformation {
    transformationArgs?: any 
    transformation: 'toUpperCase'
    | 'toLowerCase'
    | 'titleCase'
    | 'toDate'
    | 'stringToArray'
    | 'arrayToString'
}

type TreeLeaf = [string, Transform['target'][]]

type Transform = {
    source: string,
    target: {
        path: string,
        priority?: number,
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
    ValArchtype,
    TreeLeaf,
};
