import { ReactElement } from 'react';
import { ControlledDateInputProps } from '../../../hooks/form/useFormValidation';
import DateStringInput from '../InputTypes/DateStringInput';

const ControlledDateStringInput = <T extends { [key: string]: any }>(
    props: ControlledDateInputProps<T>,
): ReactElement => {
    const { name, formProps, required, ...formControlProps } = props;

    return (
        <DateStringInput
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            required={!!required}
            {...formControlProps}
        />
    );
};

export default ControlledDateStringInput;
