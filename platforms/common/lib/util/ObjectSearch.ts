const isDictionary = (value: any): boolean => {
    return typeof value === 'object' && value.constructor === Object;
};

export const find = (subject: { [k: string]: any }, key: string): any => {
    const parts = key.split('.');
    const head = parts[0];
    const tail = parts.slice(1);
    if (tail.length > 0) {
        if (isDictionary(subject) && subject.hasOwnProperty(head)) {
            const item = (subject as any)[head];
            if (Array.isArray(item) && item.every((_) => isDictionary(_))) {
                //we have an array of dictionaries...
                return (item as { [k: string]: any }[]).map((_) => find(_, tail.join('.')));
            }
            return find((subject as any)[head], tail.join('.'));
        }
    } else if (isDictionary(subject) && subject.hasOwnProperty(head)) {
        return (subject as any)[head];
    }
    return undefined;
};

export const findOrElse = <T>(subject: { [k: string]: any }, key: string, orElse: T): T | any => {
    const found = find(subject, key);
    return found === undefined ? orElse : found;
};
