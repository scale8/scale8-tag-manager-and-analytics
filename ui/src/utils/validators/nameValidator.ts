import { FormValues } from '../../hooks/form/useFormValidation';

const nameValidator = async <T extends FormValues>(value: T[keyof T]): Promise<-1 | 0 | string> => {
    return value.length >= 2 ? -1 : 0;
};

export default nameValidator;
