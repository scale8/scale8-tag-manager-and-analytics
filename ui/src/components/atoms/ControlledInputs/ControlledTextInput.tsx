import { ReactElement } from 'react';
import { ControlledInputProps } from '../../../hooks/form/useFormValidation';
import TextInput from '../InputTypes/TextInput';

const ControlledTextInput = <T extends { [key: string]: any }>(
    props: ControlledInputProps<T>,
): ReactElement => {
    const { name, formProps, requiredOnValidation, label, clearable, ...textFieldProps } = props;

    const inputLabel =
        requiredOnValidation !== undefined && requiredOnValidation ? `${label} *` : label;

    return (
        <TextInput
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            label={inputLabel}
            clearable={clearable}
            {...textFieldProps}
        />
    );
};

export default ControlledTextInput;
