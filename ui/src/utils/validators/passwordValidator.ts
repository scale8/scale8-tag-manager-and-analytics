import { FormValues } from '../../hooks/form/useFormValidation';

const passwordValidator = async <T extends FormValues>(
    value: T[keyof T],
): Promise<-1 | 0 | string> => {
    return value.length >= 3 ? -1 : 0;
};

export default passwordValidator;
