export default class ObjectClone {
    public static simple(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
}
