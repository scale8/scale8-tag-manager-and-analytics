import { FormValues } from '../../hooks/form/useFormValidation';

const confirmPasswordValidator = async <T extends FormValues>(
    value: T[keyof T],
    values: T,
): Promise<-1 | 0 | string> => {
    return value === values.newPassword ? -1 : 0;
};

export default confirmPasswordValidator;
