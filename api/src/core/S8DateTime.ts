export default class S8DateTime {
    public static isValidDateTime(dt: string) {
        return (
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.(\d{3}|\d{6}))?$/.test(dt) &&
            !isNaN(Date.parse(dt))
        );
    }

    public static isValidTimestamp(ts: number) {
        return Number.isInteger(ts) && ts > 0;
    }
}
