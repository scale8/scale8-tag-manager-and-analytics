export default class Future {
    public static runInSerial<T>(fs: (() => Promise<T>)[]): Promise<any[]> {
        const concat = (list: any[]) => Array.prototype.concat.bind(list);
        const promiseConcat = (f: () => any) => (x: Promise<T>[]) => f().then(concat(x));
        return fs.reduce(
            (acc, x: () => Promise<T>) => acc.then(promiseConcat(x)),
            Promise.resolve([]),
        );
    }
}
