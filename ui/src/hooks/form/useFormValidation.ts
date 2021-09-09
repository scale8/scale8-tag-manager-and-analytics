import {
    Dispatch,
    FocusEventHandler,
    FormEvent,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { FormControlProps } from '@material-ui/core';
import { DateTimePickerProps } from '@material-ui/pickers';
import { SwitchProps } from '@material-ui/core/Switch/Switch';
import {
    ValidateConfiguration,
    validateFormValues,
} from '../../utils/validators/validateFormValues';
import { FormCommonProps } from '../../types/props/forms/CommonFormProps';
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';

export type FormValues = { [key: string]: any };
export type FormErrors<T> = { [P in keyof T]?: string };
export type FormLoadedData = { [key: string]: any };
export type FormMutationData = { [key: string]: any };

export type FormValidationResult<T extends FormValues> = {
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
    handleChange: (
        valueKey: string,
        value: any,
        extraValues?: { valueKey: string; value: any }[],
    ) => void;
    handleBlur: () => void;
    errors: FormErrors<T>;
    values: T;
    setValues: Dispatch<SetStateAction<T>>;
    isSubmitting: boolean;
};

export type FormProps<T extends FormValues> = FormCommonProps &
    FormValidationResult<T> & {
        errors: FormErrors<T>;
        values: T;
    };

export type ControlledSwitchProps<Values extends { [key: string]: any }> = SwitchProps & {
    name: string;
    formProps: FormProps<Values>;
};

export type ControlledInputProps<Values extends { [key: string]: any }> = TextFieldProps & {
    name: string;
    requiredOnValidation?: boolean;
    formProps: FormProps<Values>;
};

export type BaseCodeInputProps = {
    name: string;
    label: string;
    mode: 'javascript' | 'css' | 'html' | 'json';
    disabled?: boolean;
    required: boolean;
};

export type CodeInputProps = BaseCodeInputProps & {
    value: string;
    setValue: (v: string) => void;
    validationError?: string;
    onBlur?: FocusEventHandler<any>;
};

export type ControlledCodeInputProps<Values extends { [key: string]: any }> = BaseCodeInputProps & {
    formProps: FormProps<Values>;
};

export type ControlledDateTimeInputProps<Values extends { [key: string]: any }> = Omit<
    DateTimePickerProps,
    'value' | 'onChange'
> & {
    name: string;
    formProps: FormProps<Values>;
};

export type ControlledDateInputProps<Values extends { [key: string]: any }> = Omit<
    DatePickerProps,
    'value' | 'onChange'
> & {
    name: string;
    formProps: FormProps<Values>;
};

export type SelectValueWithSub = {
    key: string;
    text: string;
    iconType?: string;
    icon?: JSX.Element;
    description?: string;
    sub?: SelectValueWithSub[];
    unFilteredSubCount?: number;
};

export type SelectIntValue = {
    key: number;
    text: string;
};

export type ControlledSelectProps<Values extends { [key: string]: any }> = FormControlProps & {
    name: string;
    label: string;
    values: SelectValueWithSub[];
    formProps: FormProps<Values>;
    allowEmpty?: boolean;
    requiredOnValidation?: boolean;
};

export type ControlledFilteredSelectProps<Values extends { [key: string]: any }> =
    ControlledSelectProps<Values> & {
        filterLabel: string;
        initialFilterValue?: string;
        missingSubMessage: string;
        hideNoSub?: boolean;
    };

export type ControlledBooleanSelectProps<Values extends { [key: string]: any }> =
    FormControlProps & {
        name: string;
        label: string;
        formProps: FormProps<Values>;
    };

export type ControlledColorInputProps<Values extends { [key: string]: any }> = TextFieldProps & {
    name: string;
    label: string;
    formProps: FormProps<Values>;
};

function removeCurrentFieldErrors<T extends FormValues>(
    setErrors: Dispatch<SetStateAction<FormErrors<T>>>,
    errors: FormErrors<T>,
    valueKey: string,
): void {
    setErrors(
        Object.keys(errors).reduce((newErrors: FormErrors<T>, key: keyof FormErrors<T>) => {
            if (key !== valueKey) {
                newErrors[key] = errors[key];
            }
            return newErrors;
        }, {} as FormErrors<T>),
    );
}

function verifySubmit<T>(
    isSubmitting: boolean,
    errors: FormErrors<T>,
    submitCallback: (values: T, setValues: Dispatch<SetStateAction<T>>) => Promise<void>,
    values: T,
    setValues: Dispatch<SetStateAction<T>>,
    setSubmitting: (value: ((prevState: boolean) => boolean) | boolean) => void,
    syncSubmit?: boolean,
): void {
    (async () => {
        if (isSubmitting) {
            const noErrors = Object.keys(errors).length === 0;
            if (noErrors) {
                if (syncSubmit) {
                    setSubmitting(false);
                }
                await submitCallback(values, setValues);
                if (!syncSubmit) {
                    setSubmitting(false);
                }
            } else {
                setSubmitting(false);
            }
        }
    })();
}

const useFormValidation = <T extends FormValues>(
    initialState: T,
    validators: ValidateConfiguration<T>[],
    submit: (values: T, setValues: Dispatch<SetStateAction<T>>) => Promise<void>,
    hasMappedPlatformValues?: boolean,
    customValueSetter?: (
        valueKey: string,
        value: unknown,
        values: T,
        setValues: Dispatch<SetStateAction<T>>,
    ) => void,
    syncSubmit?: boolean,
    resetValues?: Partial<T>,
): FormValidationResult<T> => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({} as FormErrors<T>);
    const [ignoreEmpty, setIgnoreEmpty] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);

    const submitCallback = useCallback(submit, []);

    const resetValuesCallback = useCallback(() => {
        if (resetValues) {
            setValues({
                ...values,
                ...resetValues,
            });
        }
    }, [resetValues]);

    useEffect(() => {
        verifySubmit(
            isSubmitting,
            errors,
            submitCallback,
            values,
            setValues,
            setSubmitting,
            syncSubmit,
        );
    }, [errors, values, isSubmitting, setSubmitting]);

    useEffect(() => {
        if (!isSubmitting) {
            resetValuesCallback();
        }
    }, [isSubmitting]);

    const handleChange = (
        valueKey: string,
        value: any,
        extraValues?: { valueKey: string; value: any }[],
    ) => {
        customValueSetter
            ? customValueSetter(valueKey, value, values, setValues)
            : setValues({
                  ...values,
                  [valueKey]: value,
                  ...(extraValues === undefined
                      ? {}
                      : extraValues.reduce(
                            (accumulator, current) => ({
                                ...accumulator,
                                [current.valueKey]: current.value,
                            }),
                            {},
                        )),
              });
        if (errors[valueKey]) {
            removeCurrentFieldErrors<T>(setErrors, errors, valueKey);
        }
        if (extraValues !== undefined) {
            extraValues.forEach((_) => {
                if (errors[_.valueKey]) {
                    removeCurrentFieldErrors<T>(setErrors, errors, _.valueKey);
                }
            });
        }
    };

    const handleBlur = () => {
        setErrors(
            validateFormValues(
                values,
                setValues,
                ignoreEmpty,
                validators,
                !!hasMappedPlatformValues,
            ),
        );
    };

    const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }
        const validationErrors = validateFormValues(
            values,
            setValues,
            false,
            validators,
            !!hasMappedPlatformValues,
        );
        setIgnoreEmpty(false);
        setErrors(validationErrors);
        setSubmitting(true);
    };

    return {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        setValues,
        errors,
        isSubmitting,
    };
};

export { useFormValidation, removeCurrentFieldErrors };
