function unidotify(str: string) {
    const unicodeDot = '\u2024';
    return replaceAll('.', unicodeDot)(str);
}

function unUnidotify(str: string) {
    const unicodeDot = '\u2024';
    return replaceAll(unicodeDot, '.')(str);
}

function replaceAll(original: string, substitute: string) {
    return (str: string) => str.split(original).join(substitute);
}

export {
    unidotify,
    unUnidotify,
    replaceAll
}