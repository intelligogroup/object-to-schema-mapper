import { applyToOneOrMany } from './transform';
import objectPath, { get } from 'object-path';
import * as chrono from 'chrono-node';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


type TConvertStringToDateOptions = {
    formats?: string[],
    ignoreFormats?: string[],
    unixTimestamp?: boolean,
    cleanPatterns?: string[],
    supportMultipleDates?: {
        separators: string[],
        selectDate: 'earliest' | 'latest'
    }
}

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

function convertFastCaseDate(fastCaseDate: string) {

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
        return new Date(Number(cleanedInput), 0, 1)
    }

    if (/^\d{2}\.\d{2}\.\d{4}$/.test(clearDate)) {
        const [day, month, year] = clearDate.split('.');
        return new Date(`${year}-${month}-${day}`);
    }

    if (/^\d{2}.\d{4}$/.test(clearDate)) {
        const [month, year] = clearDate.split('.');
        return new Date(`${year}-${month}-01`); // YYYY-MM-DD
    }

    return new Date(clearDate);
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

function parseSteeleDOB(steeleDOB: string): Date | undefined {

    if (!steeleDOB) {
        return;
    }

    // Normalize common cases of "approximately"
    const approxRegex = /^(ca\.|approximately|approx)\s*/ig;
    const cleanInput = steeleDOB.replace(approxRegex, "").trim();

    // Match full date with dashes, dots, or slashes
    const fullDateMatch = cleanInput.match(/^(\d{1,4})[-./](\d{1,2})[-./](\d{1,4})$/);
    if (fullDateMatch) {
        const year = fullDateMatch[1].length === 4 ? parseInt(fullDateMatch[1]) : parseInt(fullDateMatch[3]);
        const month = parseInt(fullDateMatch[2]) - 1;
        const day = fullDateMatch[1].length !== 4 ? parseInt(fullDateMatch[1]) : parseInt(fullDateMatch[3]);

        if (year && month >= 0 && day) {
            return new Date(year, month, day);
        }
    }

    // Match year-month (e.g., 05.1952 or 05/1952)
    const yearMonthMatch = cleanInput.match(/^(\d{1,2})[-./](\d{4})$/);

    if (yearMonthMatch) {
        const year = parseInt(yearMonthMatch[2]);
        const month = parseInt(yearMonthMatch[1]) - 1;
        if (year && month >= 0) {
            return new Date(year, month, 1);
        }
    }

    // Match only year (e.g., 1963)
    const yearMatch = cleanInput.match(/^(\d{4})$/);
    if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        return new Date(year, 0, 1);
    }

    // Match compact YYYYMMDD (e.g., 19800704)
    const compactDateMatch = cleanInput.match(/^(\d{4})(\d{2})(\d{2})$/);

    if (compactDateMatch) {
        const year = parseInt(compactDateMatch[1]);
        const month = parseInt(compactDateMatch[2]) - 1;
        const day = parseInt(compactDateMatch[3]);

        if (year && month >= 0 && day) {
            return new Date(year, month, day);
        }
    }

    // Handle case of "/?/?/1963" or similar ambiguous cases
    const ambiguousYearMatch = cleanInput.match(/\/?\/?\/?(\d{4})$/);
    if (ambiguousYearMatch) {
        const year = parseInt(ambiguousYearMatch[1]);
        return new Date(year, 0, 1);
    }

    const parseDate = chrono.parseDate(cleanInput);

    if (!parseDate) {
        throw new Error('Invalid date format');
    }

    return new Date(parseDate);
}

function parseSteeleDate(steeleDate: string): Date | undefined {

    const cleanedInput = steeleDate.replaceAll(/\/\?|-00/g, '').trim();

    if (!cleanedInput || cleanedInput === '0000') {
        return;
    }

    if (!/\d/.test(cleanedInput)) {
        return;
    }

    if (/^\d{2}\.\d{2}\.\d{4}$/.test(cleanedInput)) {
        const [day, month, year] = cleanedInput.split('.');
        return new Date(`${year}-${month}-${day}`);
    }

    if (/^\d{2}\.\d{4}$/.test(cleanedInput)) {
        const [month, year] = cleanedInput.split('.');
        return new Date(`${year}-${month}-01`);
    }

    return new Date(`${cleanedInput}-01-01`); // Add month '01' and day '01'
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

function convertSteeleDOB(steeleDOB: string) {

    if (!steeleDOB) {
        return;
    }

    if (steeleDOB.includes(';')) {

        const dates = steeleDOB.split(';');

        if (dates.length === 1) {
            return new Date(dates[0]);
        }

        const [latestDate] = dates
            .map(date => date.trim())
            .map(date => parseSteeleDOB(date))
            .sort((a, b) => b!.getTime() - a!.getTime());

        return latestDate;
    }

    return parseSteeleDOB(steeleDOB);
}

function convertClearReportDate(clearReportDate: string) {

    if (!clearReportDate) {
        return;
    }

    if (/^\d{2}\/\d{4}$/.test(clearReportDate)) {
        const [month, year] = clearReportDate.split('/');
        return new Date(`${year}-${month}-01`);
    }

    return new Date(clearReportDate);
}

function convertNYscrollDate(nyScrollDate: string) {

    if (!nyScrollDate || nyScrollDate === '-') {
        return;
    }

    return new Date(nyScrollDate);
}

function parseStringToDate(dateString: string, options: TConvertStringToDateOptions) {

    if (options.unixTimestamp) {
        return new Date(Number(dateString) * 1000)
    }

    const ignoreFormats = [
        ...(options.ignoreFormats || []),
        'XX/XX/XXXX',
        '0000'
    ];

    const cleanPatterns = [
        ...(options.cleanPatterns || []),
        '-00',
        '?/',
        'live',
        'ca.',
        'Circa',
        '00/',
        'APPROXIMATELY',
        'N/A'
    ];

    const formats = [
        ...(options.formats || []),
        'YYYY-MM',
        'YYYY'
    ];

    if (ignoreFormats.includes(dateString)) {
        return;
    }

    const cleanedInput = stringCleanup(dateString, cleanPatterns.map(pattern => ({ pattern, replacement: '' }))).trim();

    if (!cleanedInput) {
        return;
    }

    if (cleanedInput.length === 4) {
        return new Date(Number(cleanedInput), 0, 1);
    }

    if (!cleanedInput) {
        return;
    }

    if (ignoreFormats.includes(cleanedInput)) {
        return;
    }

    const parsedDate = dayjs(cleanedInput, formats, true);

    if (parsedDate.isValid()) {
        return parsedDate.toDate();
    }

    const formatDate = chrono.parseDate(cleanedInput);

    if (formatDate) {
        return formatDate;
    }

    throw new Error('Invalid date format');
}

function convertStringToDate(dateString: string, options: TConvertStringToDateOptions = {}) {

    const dates: string[] = [];

    if (!dateString) {
        return;
    }

    if (options.supportMultipleDates) {
        const { separators } = options.supportMultipleDates;

        for (const separator of separators) {

            const datesTemp = dateString.split(new RegExp(separator, 'g'));

            if (datesTemp.length > 1) {
                dates.push(...datesTemp);
                break;
            }
        }
    }

    if (!dates.length) {
        dates.push(dateString);
    }

    if (dates.length === 1) {
        return parseStringToDate(dates[0], options);
    }


    const [relevantDate] = dates
        .map(date => parseStringToDate(date, options))
        .filter(date => date)
        .sort((a, b) => options.supportMultipleDates?.selectDate === 'earliest' ? a!.getTime() - b!.getTime() : b!.getTime() - a!.getTime());

    return relevantDate;
}

// console.log(convertStringToDate('circa 1990', {
//     // supportMultipleDates: {
//     //     separators: [',\\s+(?=(?:[A-Za-z]+\\s+\\d{1,2},\\s+\\d{4})|(?:\\d{4}-\\d{2}-\\d{2}))', ','],
//     //     selectDate: 'earliest'
//     // }
// }))

function stringCleanup(value: string, options: { pattern: string, replacement: string }[]) {

    let cleanedValue = value;

    for (const { pattern, replacement } of options) {
        cleanedValue = cleanedValue.toLowerCase().replaceAll(pattern.toLowerCase(), replacement);
    }

    return cleanedValue;
}

function analystCollectionLegalConvertDate(value: string) {

    if (!value) {
        return;
    }

    const match = value.match(/^\d{2}\/\d{2}\/\d{4}/);

    if (!match?.length) {
        throw new Error('Invalid date format');
    }

    return new Date(match[0]);
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
        convertStringToDate,
        convertFastCaseDate,
        convertClearDate,
        convertSteeleDate,
        convertClearReportDate,
        convertNYscrollDate,
        stringCleanup,
        analystCollectionLegalConvertDate,
        convertSteeleDOB
    }
}