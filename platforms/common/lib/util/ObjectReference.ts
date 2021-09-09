export default class ObjectReference {
    public static getReferenceFromPath(path: string, obj: any, createParentIfMissing = false): any {
        if (path === '') {
            return typeof obj === 'object' ? obj : undefined;
        } else {
            const parts = path.split('.');
            const head = parts[0] as string;
            if (parts.length > 1) {
                const tail = parts.slice(1);
                if (typeof obj === 'object' && obj.hasOwnProperty(head)) {
                    return this.getReferenceFromPath(
                        tail.join('.'),
                        obj[head],
                        createParentIfMissing,
                    );
                } else if (typeof obj === 'object' && createParentIfMissing) {
                    obj[head] = {};
                    return this.getReferenceFromPath(
                        tail.join('.'),
                        obj[head],
                        createParentIfMissing,
                    );
                } else {
                    return undefined;
                }
            } else {
                return typeof obj === 'object' ? obj[head] : undefined;
            }
        }
    }

    public static setValueFromPath(
        path: string,
        obj: any,
        value: any,
        createParentIfMissing = false,
        allowOverwriting = true,
    ): boolean {
        const parts = path.split('.');
        const reference = this.getReferenceFromPath(path, obj, createParentIfMissing);
        if (reference !== undefined && !allowOverwriting) {
            return false;
        }
        const parent = this.getReferenceFromPath(parts.slice(0, -1).join('.'), obj);
        if (typeof parent === 'object') {
            parent[parts.slice(-1)[0]] = value;
            return true;
        } else {
            return false;
        }
    }
}
