import { FormValues } from '../../hooks/form/useFormValidation';

const requiredStringValidator = async <T extends FormValues>(
    value: T[keyof T],
): Promise<-1 | 0 | string> => {
    return value.length === 0 ? 0 : -1;
};

export default requiredStringValidator;
