import { FormValues } from '../../hooks/form/useFormValidation';

const parsedCodeValidator = async <T extends FormValues>(
    value: T[keyof T],
): Promise<-1 | 0 | string> => {
    const interpreter = await import('@scale8/s8-interpreter');

    try {
        new interpreter.Interpreter(value);
    } catch (e) {
        return (<Error>e).message;
    }
    return -1;
};

export default parsedCodeValidator;
