import { FormValues } from '../../hooks/form/useFormValidation';

const keyValidator = async <T extends FormValues>(value: T[keyof T]): Promise<-1 | 0 | string> => {
    return value.match(/^[a-z_]+[a-z0-9_]*$/) !== null ? -1 : 0;
};

export default keyValidator;
