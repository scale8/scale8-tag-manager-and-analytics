import { FormValues } from '../../hooks/form/useFormValidation';

const emailValidator = async <T extends FormValues>(
    value: T[keyof T],
): Promise<-1 | 0 | string> => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? -1 : 0;
};

export default emailValidator;
