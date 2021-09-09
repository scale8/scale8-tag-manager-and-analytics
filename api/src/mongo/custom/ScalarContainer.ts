import { GQLScalar } from '../types/Types';

export default class ScalarContainer<T extends GQLScalar> {
    private readonly _arr: T[];
    constructor(...arr: T[]) {
        this._arr = arr;
    }
    get arr(): T[] {
        return this._arr;
    }
    public equals(sc: ScalarContainer<GQLScalar>): boolean {
        if (sc.arr.length === this._arr.length) {
            return this._arr.every((leftValue, i) => {
                const rightValue = sc.arr[i];
                if (leftValue instanceof Date && rightValue instanceof Date) {
                    return leftValue.toISOString() === rightValue.toISOString();
                } else {
                    return leftValue === rightValue;
                }
            });
        } else {
            return false; //arrays can't be the same if the length is different
        }
    }
    public toString(): string {
        return `[${this._arr.join(',')}]`;
    }
}
