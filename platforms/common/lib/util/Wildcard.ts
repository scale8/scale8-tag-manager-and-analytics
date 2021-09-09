export default class Wildcard {
    public static test(str: string, pattern: string): boolean {
        return new RegExp(
            '^' +
                pattern
                    .split('*')
                    .map((_) => _.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'))
                    .join('.*') +
                '$',
        ).test(str);
    }
}
