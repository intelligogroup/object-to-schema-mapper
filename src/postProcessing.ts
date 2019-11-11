import objectPath from 'object-path';
import { SomeObj, Transform, InstructionStrategies } from "./utils/types";

const strategies: InstructionStrategies = {
    conditionalValue: isConditionalValueExist
}

function postProcessCreatedObject(createdObject: SomeObj, transformations: Transform[]) {
    const executeInstruction = processInstruction(createdObject);
    return transformations
        .filter(
            transform => Object
                .keys(strategies)
                .find(postProcessKey => Object.keys(transform.target).join(',').includes(postProcessKey))
        )
        .map(transform => transform.target)
        .reduce((_, instruction) => executeInstruction(instruction), createdObject);
}

function followInstruction(object: SomeObj, instruction) {
    return Object
        .keys(instruction)
        .reduce(
            (processedObject, key) => strategies[key]
                ? strategies[key](processedObject, instruction)
                : processedObject
            ,
            object
        );
}

function isConditionalValueExist(object: SomeObj, instruction) {
    const pathCondition = instruction.conditionalValue.targetPathCondition;
    if (objectPath.has(object, pathCondition)) {
        objectPath.set(object, instruction.path, instruction.conditionalValue.value);
    }
    return object;
}

function processInstruction(baseObject: SomeObj) {
    return instruction => followInstruction(baseObject, instruction);
}

export { postProcessCreatedObject }
