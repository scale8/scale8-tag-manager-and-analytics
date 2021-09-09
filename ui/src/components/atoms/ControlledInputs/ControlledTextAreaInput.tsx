import { ReactElement } from 'react';
import TextAreaInput from '../InputTypes/TextAreaInput';
import { ControlledInputProps } from '../../../hooks/form/useFormValidation';

const ControlledTextAreaInput = <T extends { [key: string]: any }>(
    props: ControlledInputProps<T>,
): ReactElement => {
    const { name, formProps, requiredOnValidation, label, ...textFieldProps } = props;

    const inputLabel =
        requiredOnValidation !== undefined && requiredOnValidation ? `${label} *` : label;

    return (
        <TextAreaInput
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            label={inputLabel}
            {...textFieldProps}
        />
    );
};

export default ControlledTextAreaInput;
