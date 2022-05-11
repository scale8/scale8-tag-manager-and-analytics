import { ReactElement } from 'react';
import { ControlledCheckboxProps } from '../../../hooks/form/useFormValidation';
import CheckBoxInput from '../InputTypes/CheckBoxInput';

const ControlledCheckbox = <T extends { [key: string]: any }>(
    props: ControlledCheckboxProps<T>,
): ReactElement => {
    const { name, formProps, ...checkboxProps } = props;

    return (
        <CheckBoxInput
            {...checkboxProps}
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
        />
    );
};

export default ControlledCheckbox;
