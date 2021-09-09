import { ReactElement } from 'react';
import { ControlledColorInputProps } from '../../../hooks/form/useFormValidation';
import ColorInput from '../InputTypes/ColorInput';

const ControlledColorInput = <T extends { [key: string]: any }>(
    props: ControlledColorInputProps<T>,
): ReactElement => {
    const { name, formProps, disabled, ...inputProps } = props;

    return (
        <ColorInput
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            disabled={!!disabled}
            {...inputProps}
        />
    );
};

export default ControlledColorInput;
