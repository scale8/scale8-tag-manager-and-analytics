import FieldProps from '../interfaces/FieldProps';
import ModelReflect from '../reflect/ModelReflect';
import { ModelType } from '../types/Types';

export default function Field<T extends ModelType>(fieldProps: FieldProps<T>) {
    return function (target: Record<string, any>, k: string) {
        ModelReflect.addFieldMapping(target.constructor.name, k, fieldProps);
    };
}
