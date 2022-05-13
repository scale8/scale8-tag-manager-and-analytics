import {
    Dispatch,
    FocusEventHandler,
    FormEvent,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { FormControlProps } from '@mui/material';
import { SwitchProps } from '@mui/material/Switch/Switch';
import {
    ValidateConfiguration,
    validateFormValues,
} from '../../utils/validators/validateFormValues';
import { FormCommonProps } from '../../types/props/forms/CommonFormProps';
import { BooleanInputProps } from '../../components/atoms/InputTypes/CheckBoxInput';

export type FormValues = { [key: string]: any };
export type FormErrors<T> = { [P in keyof T]?: string };
export type FormLoadedData = { [key: string]: any };
export type FormMutationData = { [key: string]: any };

export type FormFieldProps<T extends FormValues> = {
    handleChange: (
        valueKey: string,
        value: any,
        extraValues?: { valueKey: string; value: any }[],
    ) => void;
    handleBlur: () => void;
    errors: FormErrors<T>;
    values: T;
    setValues: Dispatch<SetStateAction<T>>;
};

export type FormValidationResult<T extends FormValues> = FormFieldProps<T> & {
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
};

export type FormProps<T extends FormValues> = FormCommonProps & FormValidationResult<T>;

export type ControlledSwitchProps<Values extends { [key: string]: any }> = SwitchProps & {
    name: string;
    formProps: FormFieldProps<Values>;
};

export type ControlledCheckboxProps<Values extends { [key: string]: any }> = Omit<
    BooleanInputProps,
    'value' | 'setValue'
> & {
    name: string;
    formProps: FormFieldProps<Values>;
};

export type ControlledInputProps<Values extends { [key: string]: any }> = TextFieldProps & {
    name: string;
    requiredOnValidation?: boolean;
    clearable?: boolean;
    formProps: FormFieldProps<Values>;
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
    formProps: FormFieldProps<Values>;
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
    resetErrorsOnKeys?: string[];
    formProps: FormFieldProps<Values>;
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
        formProps: FormFieldProps<Values>;
    };

export type ControlledGenericStringInputProps<Values extends { [key: string]: any }> =
    TextFieldProps & {
        name: string;
        label: string;
        formProps: FormFieldProps<Values>;
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
    resetValues?: (values: T, setValues: Dispatch<SetStateAction<T>>) => void,
): FormValidationResult<T> => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({} as FormErrors<T>);
    const [ignoreEmpty, setIgnoreEmpty] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);

    const submitCallback = useCallback(submit, []);

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
        if (!isSubmitting && resetValues !== undefined && Object.keys(errors).length === 0) {
            resetValues(values, setValues);
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
