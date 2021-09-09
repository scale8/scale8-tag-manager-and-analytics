import { FormValues } from '../../hooks/form/useFormValidation';

const confirmEmailValidator = async <T extends FormValues>(
    value: T[keyof T],
    values: T,
): Promise<-1 | 0 | string> => {
    return value === values.email ? -1 : 0;
};

export default confirmEmailValidator;
