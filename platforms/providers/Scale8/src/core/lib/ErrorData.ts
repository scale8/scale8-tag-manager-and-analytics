import ObjectReference from '../../../../../common/lib/util/ObjectReference';

type ErrorDataType = {
    file: string;
    message: string;
    column: number;
    line: number;
};

type cb = (errorData: ErrorDataType) => void;

export default class ErrorData {
    private static errorData?: ErrorDataType;
    private static readonly updateHooks: cb[] = [];

    public static addUpdateHook(cb: cb): void {
        this.updateHooks.push(cb);
    }

    public static dump(): { [k: string]: any } {
        return this.errorData || {};
    }

    public static get(k: string): any {
        return ObjectReference.getReferenceFromPath(k, this.dump());
    }

    public static setLastError(err: ErrorEvent) {
        //update here...
        this.errorData = {
            file: err.filename,
            message: err.message,
            column: err.colno,
            line: err.lineno,
        };
        this.updateHooks.forEach((_) => _(this.errorData!));
    }
}
