export class RefId {
    private readonly _id: string;

    public constructor(id: string) {
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    public toString(): string {
        return this._id;
    }

    public equals(refId: RefId): boolean {
        return this.id === refId.id;
    }
}
