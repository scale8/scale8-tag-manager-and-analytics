import { ReactElement } from 'react';
import { ControlledInputProps } from '../../../hooks/form/useFormValidation';
import FloatInput from '../InputTypes/FloatInput';

const ControlledFloatInput = <T extends { [key: string]: any }>(
    props: ControlledInputProps<T>,
): ReactElement => {
    const { name, formProps, ...textFieldProps } = props;

    return (
        <FloatInput
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            {...textFieldProps}
        />
    );
};

export default ControlledFloatInput;
