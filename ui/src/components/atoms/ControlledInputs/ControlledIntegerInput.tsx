import { ReactElement } from 'react';
import { ControlledInputProps } from '../../../hooks/form/useFormValidation';
import IntegerInput from '../InputTypes/IntegerInput';

const ControlledIntegerInput = <T extends { [key: string]: any }>(
    props: ControlledInputProps<T>,
): ReactElement => {
    const { name, formProps, ...textFieldProps } = props;

    return (
        <IntegerInput
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            {...textFieldProps}
        />
    );
};

export default ControlledIntegerInput;
