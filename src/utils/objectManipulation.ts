type Path = string[];

const getNestedValue = (obj: any) => (path: string[]): any => {
    if (obj == null) {
        return null;
    }
    const [key, ...nextKeys] = path;
    return nextKeys.length > 0
        ? getNestedValue(obj[key])(nextKeys)
        : obj[key]
            ? obj[key]
            : null;
};

const setNestedValue = (obj: any, value: any) => (path: string[]): any => {
    if (obj == null) {
        return null;
    }
    const [key, ...nextKeys] = path;
    if (!Object.keys(obj).includes(key)) {
        obj.key = null;
    }
    return nextKeys.length > 0
        ? setNestedValue(obj[key], value)(nextKeys)
        : Object.assign(obj, { [key]: value });
}

const isNonEmptyString = (str: string) => str.trim().length > 0;

const getFromArray = (arr: any[]) => (path: Path): any[] => {
    if (arr == null) {
        return [];
    } else if (path != null) {
        return arr.map(obj => getNestedValue(obj)(path));
    } else {
        return arr.reduce((acc, val) => acc.concat(val), []);
    }
};

const getSeveral = (obj: any) => (pathArray: Path[]): any => {
    if (obj == null) {
        return [];
    } else if (Array.isArray(obj)) {
        const keysToExtract = pathArray.reduce((acc, elm) => [...acc, ...elm], []);
        return obj
            .map(source =>
                Object
                    .keys(source)
                    .filter(key => keysToExtract.includes(key))
                    .reduce((acc, key) => ({ ...acc, ...{ [key]: source[key] } }), {})
            )
    } else {
        return obj == null ? [] : pathArray.map(path => getNestedValue(obj)(path));
    }
};

const progressNestedObject = (result: any, operation: any) => {
    if (result == null || result.length == 0) {
        return result;
    }
    const { fn, path } = operation;
    const ans = fn(result)(path);
    if (Array.isArray(ans)) {
        return ans.filter(obj => obj != null);
    }
    return ans;
};

const NestedOfObject = function (root: object) {
    this.operations = [];
    this.isArray = false;

    this.addOperation = ({ fn, path }: { fn: Function, path: Path }) => {
        this.operations = [...this.operations, { fn, path }];
    }

    this.inPath = (path: Path) => {
        this.addOperation({ fn: getNestedValue, path });
        return this;
    }

    this.inArray = (path: Path) => {
        this.isArray = true;
        this.addOperation({ fn: getFromArray, path });
        return this;
    }

    this.several = (pathArray: Path[]) => {
        this.addOperation({ fn: getSeveral, path: pathArray });
        return this;
    }

    this.filterNullsInArray = (arr: any[]) =>
        arr.map(
            inner => Array.isArray(inner)
                ? inner.filter(el => el != null)
                : inner
        ).filter(el => el != null);

    this.get = () => {
        const ans = this.operations.reduce(progressNestedObject, root);
        if (Array.isArray(ans)) {
            return this.filterNullsInArray(ans);
        }
        return ans;
    }

    this.exist = () => {
        if (this.isArray) {
            const ans = NestedOf(this.get()).inArray().get();
            return ans != null && ans.length > 0;
        }
        return this.get() != null;
    }
}

function NestedOf(root: object): any {
    return new NestedOfObject(root);
}

export { NestedOf, };
