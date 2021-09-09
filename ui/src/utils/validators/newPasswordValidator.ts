import { FormValues } from '../../hooks/form/useFormValidation';

const newPasswordValidator = async <T extends FormValues>(
    value: T[keyof T],
): Promise<-1 | 0 | string> => {
    return value.length >= 6 ? -1 : 0;
};

export default newPasswordValidator;
