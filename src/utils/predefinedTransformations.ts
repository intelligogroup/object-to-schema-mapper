import { applyToOneOrMany } from './transform';

const toLowerCase = applyToOneOrMany<string, string>(str => str.toLowerCase());
const toUpperCase = applyToOneOrMany<string, string>(str => str.toUpperCase());
const titleCase = applyToOneOrMany<string, string>(str => str
    .split(/\s/)
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ')
)
const toDate = applyToOneOrMany<string, Date>(str => new Date(str));
const stringToArray = applyToOneOrMany<string, string[]>((str, separator) => str.split(separator as string));

export const strategies = {
    predefinedTransformations: {
        toUpperCase: (str: string | string[]) => toUpperCase(str),
        toLowerCase: (str: string | string[]) => toLowerCase(str),
        titleCase: (str: string | string[]) => titleCase(str),
        toDate: (str: string | string[]) => toDate(str),
        arrayToString: (arr: string[], separator: string) => arr.join(separator),
        stringToArray: (str: string | string[], separator: string) => stringToArray(str, separator),
    }
}
