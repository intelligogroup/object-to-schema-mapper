import { applyToOneOrMany } from './transform';
import objectPath, { get } from 'object-path';
import * as chrono from 'chrono-node';


const toLowerCase = applyToOneOrMany<string, string>(str => str.toLowerCase());
const toUpperCase = applyToOneOrMany<string, string>(str => str.toUpperCase());
const titleCase = applyToOneOrMany<string, string>(titleCaseTransformer)
const companyNameFormat = applyToOneOrMany<string, string>(companyNameTransformer)

function titleCaseTransformer(str) {
    const keepCapitalizedWords = [
        "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"
    ];

    const makeCapitalizedWords = [
        'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA',
        'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT',
        'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD',
        'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY', "UK", "US", "USA"
    ];

    if (!str) {
        return str;
    }

    return str.trim()
        .split(/\s+/)
        .map(word => {
            const cleanedWord = word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');

            if (keepCapitalizedWords.includes(cleanedWord)) {
                return word;
            }

            const cleanedWordIWithEscapeChars = cleanedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const capitalizeWordPattern = new RegExp(`^${cleanedWordIWithEscapeChars}$`, 'i');
            if (makeCapitalizedWords.some(w => capitalizeWordPattern.test(w))) {
                return word.toUpperCase();
            }

            let firstLetterIndex = word.search(/[a-zA-Z]/);
            if (firstLetterIndex !== -1) {
                return word.slice(0, firstLetterIndex) +
                    word.charAt(firstLetterIndex).toUpperCase() +
                    word.slice(firstLetterIndex + 1).toLowerCase();
            }

            return word;
        })
        .join(' ');
}


const toDate = applyToOneOrMany<string, string>(str => new Date(str).toISOString());
const stringToArray = applyToOneOrMany<string, string[]>((str, separator) => str.split(separator as string));

function fromTracerDate(tracerDate: number) {

    if (!tracerDate) {
        return;
    }

    const year = String(tracerDate).substr(0, 4);
    const month = String(tracerDate).substr(4, 2);
    const day = String(tracerDate).substr(6, 2);

    return new Date(`${year}-${month}-${day}`).toString();
}


function tracerPropertyDocumentType(documentType: string) {

    let value;

    switch (documentType) {

        case 'G': {
            value = 'Grant Deed/Deed of Trust';
            break;
        }

        case 'H': {
            value = 'High Liability';
            break;
        }

        case 'Q': {
            value = 'Quitclaim/Deed of Trust';
            break;
        }

        case 'W': {
            value = 'Warranty Deed/Deed of Trust';
            break;
        }

        default: {
            value = documentType
            break;
        }
    }

    return value;
}

function tracerPropertyTransferType(documentType: string) {

    let value;

    switch (documentType) {
        case 'R': {
            value = 'Resale';
            break;
        }

        case 'S': {
            value = 'Subdivision';
            break;
        }

        default: {
            value = documentType
            break;
        }
    }

    return value;
}

function dateToYear(date: string) {

    if (!date || !new Date(date).getFullYear()) {
        return
    }

    return new Date(date).getFullYear();
}

function arrayObjectKeyToString(value, options) {

    const { path, separator } = options;
    if (!Array.isArray(value)) {
        throw new Error('the value is not array');
    }

    return value
        .filter(entry => get(entry, path))
        .map(entry => get(entry, path))
        .join(separator);
}

function arrayObjectKeyToArrayString(value, options) {

    const { path, separator } = options;
    if (!Array.isArray(value)) {
        throw new Error('the value is not array');
    }

    return value
        .filter(entry => get(entry, path))
        .map(entry => get(entry, path));
}

function stringArrayToObjectArray(stringArrayValue: string[], options: { targetPath: string }): (Record<string, any> | undefined)[] | undefined {
    if (!stringArrayValue || !Array.isArray(stringArrayValue)) {
        return undefined
    }
    return stringArrayValue.map(str => {
        const original = {}
        objectPath.set(original, options.targetPath, str)
        return original
    })
}

function companyAddressType(addressType: string) {
    let value;

    switch (addressType) {
        case 'HQ': {
            value = 'HEADQUARTERS';
            break;
        }

        case 'AGENT ADDRESS': {
            value = 'OFFICER';
            break;
        }

        default: {
            value = addressType.toLowerCase().includes('officer') ?
                'OFFICER' :
                'OTHER'
            break;
        }
    }

    return value;
}

function fieldConditionMapping(value, options) {

    const {
        pathToCheck,
        condition,
        conditionValue,
        valueToMap,
        pathToMap,
        keepOriginalValue
    }: {
        pathToCheck: string,
        condition: 'exists' | 'equals' | 'contains' | 'notEqual' | 'notContain',
        conditionValue: string,
        valueToMap: string | number,
        pathToMap: string,
        keepOriginalValue: boolean
    } = options;

    const valueToCheck: string = get(value, pathToCheck);


    let pass;

    switch (condition) {
        case 'exists':
            const flag = valueToCheck !== undefined && valueToCheck !== null;
            pass = conditionValue ? flag : !flag;
            break;
        case 'equals':
            pass = ((valueToCheck !== undefined && valueToCheck !== null) && conditionValue === valueToCheck);
            break;
        case 'contains':
            pass = ((valueToCheck !== undefined && valueToCheck !== null) && (valueToCheck || '').toLowerCase().includes(conditionValue.toLowerCase()));;
            break;
        case 'notEqual':
            pass = (valueToCheck && !(conditionValue === valueToCheck));
            break;
        case 'notContain':
            pass = ((valueToCheck !== undefined && valueToCheck !== null) && !(valueToCheck || '').toLowerCase().includes(conditionValue.toLowerCase()));;
            break;
    }

    return pass ?
        pathToMap ?
            get(value, pathToMap) :
            valueToMap :
        keepOriginalValue ? value : undefined
}

function invertBooleanValue(value: boolean) {
    if (typeof value !== 'boolean') {
        return undefined
    }
    return !value
}


function joinObjectKeysToString(value, options) {
    const {
        keysToJoin,
        seperator
    }: {
        keysToJoin: string[],
        seperator: string
    } = options;

    let valueToMap = '';

    for (const key of keysToJoin) {
        const valueToCheck: string = get(value, key);
        if (valueToCheck) {
            if (seperator) {
                valueToMap = valueToMap ? valueToMap + `${seperator} ${valueToCheck}` : valueToCheck;
                continue;
            }
            valueToMap = valueToMap ? valueToMap + ` ${valueToCheck}` : valueToCheck;
        }
        valueToMap = valueToMap.trim();
    }
    return valueToMap;
}

function companyNameTransformer(str: string) {
    if (!str) {
        return str;
    }

    const businessStructureAbbreviations = [
        "Col", "Corp", "Corp.", "Inc", "LC", "LLC", "LLLP", "LLP", "LP", "Ltd", "PC", "PLLC", "GP",
        "Co.", "col", "corp", "corp.", "inc", "lc", "llc", "lllp", "llp", "lp", "ltd", "pc", "pllc", "gp",
        "co"];


    const words = str.trim().split(/\s+/);

    const transformedWords = words.map(word => {
        const cleanedWord = word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

        if (businessStructureAbbreviations.includes(cleanedWord)) {
            return word;
        }

        return titleCaseTransformer(word);
    });

    return transformedWords.join(' ');
}

async function convertFastCaseDate(fastCaseDate: string) {

    if (!fastCaseDate) {
        return;
    }

    const jsDate = new Date(fastCaseDate);

    if (jsDate instanceof Date && !isNaN(jsDate.getTime())) {
        return jsDate;
    }

    const match = fastCaseDate.match(/\/Date\((-?\d+)([+-]\d{4})\)\//);

    if (!match) {
        throw new Error('Invalid date format');
    }
    const milliseconds = parseInt(match[1], 10);
    const offset = match[2];

    const date = new Date(milliseconds);

    const offsetHours = parseInt(offset.slice(0, 3), 10);
    const offsetMinutes = parseInt(offset.slice(3), 10);
    const offsetMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000;

    const normalizedDate = new Date(date.getTime() - offsetMilliseconds);

    return normalizedDate;
}

function parseClearDate(clearDate: string): Date {

    const cleanedInput = clearDate.replace(/^(ca\.?|around|approximately)\s*/i, '').trim();
    if (String(cleanedInput).length === 4) {
        return new Date(Number(clearDate), 0, 1)
    }

    return chrono.parseDate(clearDate) as Date;
}

function convertClearDate(clearDate: string) {

    if (!clearDate) {
        return;
    }

    if (clearDate.includes(';')) {

        const dates = clearDate.split(';');


        if (dates.length === 1) {
            return parseClearDate(dates[0]);
        }

        const [earlyDate] = dates
            .map(date => date.trim())
            .map(date => parseClearDate(date))
            .sort((a, b) => a!.getTime() - b!.getTime());

        return earlyDate;
    }

    return parseClearDate(clearDate);
}

function parseSteeleDate(steeleDate: string): Date {

    if (/^\d{2}\.\d{2}\.\d{4}$/.test(steeleDate)) {
        const [day, month, year] = steeleDate.split('.');
        return new Date(`${year}-${month}-${day}`);
    }

    if (/^\d{4}-\d{2}$/.test(steeleDate)) {
        return new Date(`${steeleDate}-01`); // Add day '01'
    }

    return new Date(`${steeleDate}-01-01`); // Add month '01' and day '01'
}

function convertSteeleDate(steeleDate: string) {

    if (!steeleDate) {
        return;
    }

    if (steeleDate.includes(';')) {

        const dates = steeleDate.split(';');


        if (dates.length === 1) {
            return parseSteeleDate(steeleDate[0]);
        }

        const [earlyDate] = dates
            .map(date => date.trim())
            .map(date => parseSteeleDate(date))
            .sort((a, b) => a!.getTime() - b!.getTime());

        return earlyDate;
    }

    return parseSteeleDate(steeleDate);
}

export const strategies = {
    predefinedTransformations: {
        toUpperCase: (str: string | string[]) => toUpperCase(str),
        toLowerCase: (str: string | string[]) => toLowerCase(str),
        titleCase: (str: string | string[]) => titleCase(str),
        companyNameFormat: (str: string | string[]) => companyNameFormat(str),
        toDate: (str: string | string[]) => toDate(str),
        arrayToString: (arr: string[], separator: string) => arr.join(separator),
        stringToArray: (str: string | string[], separator: string) => stringToArray(str, separator),
        fromTracerDate,
        tracerPropertyDocumentType,
        tracerPropertyTransferType,
        companyAddressType,
        dateToYear,
        arrayObjectKeyToString,
        arrayObjectKeyToArrayString,
        fieldConditionMapping,
        joinObjectKeysToString,
        invertBooleanValue,
        stringArrayToObjectArray,
        convertStringToDate: (str: string) => chrono.parseDate(str),
        convertFastCaseDate,
        convertClearDate,
        convertSteeleDate
    }
}