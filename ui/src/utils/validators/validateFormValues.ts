import { FormErrors, FormValues } from '../../hooks/form/useFormValidation';
import { Dispatch, SetStateAction } from 'react';
import { validateMappedPlatformValues } from './validateMappedPlatformValues';
import { ValuesWithMappedPlatformData } from '../../types/MappedPlatformValuesTypes';

export type ValidateConfiguration<T extends FormValues> = {
    field: keyof T;
    validator: (value: T[keyof T], values: T) => Promise<-1 | 0 | string>; // Validator returns -1 if valid, 0 or a message if not
    error: (result: 0 | string) => string;
    ignoreEmpty?: boolean;
};

const validateFormValues = <T extends FormValues>(
    values: T,
    setValues: Dispatch<SetStateAction<T>>,
    ignoreEmpty: boolean,
    validators: ValidateConfiguration<T>[],
    hasMappedPlatformValues: boolean,
): FormErrors<T> => {
    const errors = {} as FormErrors<T>;
    validators.forEach(async (_) => {
        const stringValue = typeof values[_.field] === 'string' ? (values[_.field] as string) : '';
        if ((!ignoreEmpty && !_.ignoreEmpty) || stringValue.length !== 0) {
            const validationResult = await _.validator(values[_.field], values);
            if (validationResult !== -1) {
                errors[_.field] = _.error(validationResult);
            }
        }
    });

    if (hasMappedPlatformValues) {
        // Validate mappedPlatformValues
        const { mappedPlatformValues, hasErrors } = validateMappedPlatformValues(
            values.mappedPlatformValues ?? [],
            ignoreEmpty,
        );
        setValues({
            ...values,
            mappedPlatformValues,
        });
        if (hasErrors) {
            (errors as FormErrors<ValuesWithMappedPlatformData<T>>).mappedPlatformValues =
                'Error in platform values';
        }
    }

    return errors;
};

export { validateFormValues };
