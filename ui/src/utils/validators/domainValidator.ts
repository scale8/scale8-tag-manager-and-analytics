import { FormValues } from '../../hooks/form/useFormValidation';

const domainValidator = async <T extends FormValues>(
    value: T[keyof T],
): Promise<-1 | 0 | string> => {
    const pattern = new RegExp(
        '^((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            'localhost|' + // OR localhost
            '((\\d{1,3}\\.){3}\\d{1,3}))$', // OR ip (v4) address
        'i',
    );
    return pattern.test(value) ? -1 : 0;
};

export default domainValidator;
