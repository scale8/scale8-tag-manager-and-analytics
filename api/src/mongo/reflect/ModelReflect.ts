import FieldProps from '../interfaces/FieldProps';

type ModelMap = Map<string, Map<string, FieldProps<any>>>;

export default class ModelReflect {
    protected static readonly COMMON_MODEL_NAME = 'Model';
    protected static modelMap: ModelMap = new Map();

    public static addFieldMapping(
        collectionName: string,
        fieldName: string,
        fieldProps: FieldProps<any>,
    ): void {
        if (this.modelMap.has(collectionName)) {
            const fieldMap = this.modelMap.get(collectionName) || new Map();
            this.modelMap.set(collectionName, new Map([...fieldMap, [fieldName, fieldProps]]));
        } else {
            //no record, we can just push this straight in...
            this.modelMap.set(collectionName, new Map([[fieldName, fieldProps]]));
        }
    }

    public static getMappingForCollection(collectionName: string): Map<string, FieldProps<any>> {
        const commonModelMap = this.modelMap.get(this.COMMON_MODEL_NAME) || new Map();
        const modelMap = this.modelMap.get(collectionName) || new Map();
        return new Map([...commonModelMap, ...modelMap]);
    }
}
