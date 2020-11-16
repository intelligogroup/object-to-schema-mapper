import { Interface } from "readline"

type SomeObj = { [key: string]: any }

type InstructionStrategies = {
    [key: string]: (object: SomeObj, instruction) => SomeObj;
}

interface PredefinedTransformation {
    transformationArgs?: any
    transformation: string,
    options?: { [key: string]: any }
}

type TreeLeaf = [string, Transform['target'][]]

export interface ITarget {

    path: string,
    priority?: number,
    defaultValue?: any,
    conditionalValue?: {
        targetPathCondition: string,
        value: any
    }
    predefinedTransformations?: PredefinedTransformation[]
}
type Transform = {
    source: string,
    target: ITarget

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
