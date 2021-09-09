import { FormValues } from '../../hooks/form/useFormValidation';

const urlValidator = async <T extends FormValues>(value: T[keyof T]): Promise<-1 | 0 | string> => {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            'localhost|' + // OR localhost
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i',
    );
    return pattern.test(value) ? -1 : 0;
};

export default urlValidator;
