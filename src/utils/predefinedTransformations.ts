import { applyToOneOrMany } from './transform';
import { get } from 'object-path';

const toLowerCase = applyToOneOrMany<string, string>(str => str.toLowerCase());
const toUpperCase = applyToOneOrMany<string, string>(str => str.toUpperCase());
const titleCase = applyToOneOrMany<string, string>(str => str
    .split(/\s/)
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ')
)
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

export const strategies = {
    predefinedTransformations: {
        toUpperCase: (str: string | string[]) => toUpperCase(str),
        toLowerCase: (str: string | string[]) => toLowerCase(str),
        titleCase: (str: string | string[]) => titleCase(str),
        toDate: (str: string | string[]) => toDate(str),
        arrayToString: (arr: string[], separator: string) => arr.join(separator),
        stringToArray: (str: string | string[], separator: string) => stringToArray(str, separator),
        fromTracerDate,
        tracerPropertyDocumentType,
        tracerPropertyTransferType,
        companyAddressType,
        dateToYear,
        arrayObjectKeyToString
    }
}
