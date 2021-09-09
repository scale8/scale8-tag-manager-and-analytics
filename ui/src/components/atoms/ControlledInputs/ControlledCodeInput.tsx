import { ReactElement } from 'react';
import { ControlledCodeInputProps } from '../../../hooks/form/useFormValidation';
import CodeInput from '../InputTypes/CodeInput';

const ControlledCodeInput = <T extends { [key: string]: any }>(
    props: ControlledCodeInputProps<T>,
): ReactElement => {
    const { name, formProps, disabled, ...codeInputProps } = props;

    return (
        <CodeInput
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            disabled={!!disabled}
            {...codeInputProps}
        />
    );
};

export default ControlledCodeInput;
