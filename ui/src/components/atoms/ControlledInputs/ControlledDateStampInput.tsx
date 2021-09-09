import { ReactElement } from 'react';
import DateStampInput from '../InputTypes/DateStampInput';
import { ControlledDateInputProps } from '../../../hooks/form/useFormValidation';

const ControlledDateStampInput = <T extends { [key: string]: any }>(
    props: ControlledDateInputProps<T>,
): ReactElement => {
    const { name, formProps, required, ...formControlProps } = props;

    return (
        <DateStampInput
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

export default ControlledDateStampInput;
