import { FormValues } from '../../hooks/form/useFormValidation';

const code2faValidator = async <T extends FormValues>(
    value: T[keyof T],
): Promise<-1 | 0 | string> => {
    return value.length === 6 ? -1 : 0;
};

export default code2faValidator;
