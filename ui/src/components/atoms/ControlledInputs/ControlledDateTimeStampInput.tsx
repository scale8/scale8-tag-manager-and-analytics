import { ReactElement } from 'react';
import { ControlledDateTimeInputProps } from '../../../hooks/form/useFormValidation';
import DateTimeStampInput from '../InputTypes/DateTimeStampInput';

const ControlledDateTimeStampInput = <T extends { [key: string]: any }>(
    props: ControlledDateTimeInputProps<T>,
): ReactElement => {
    const { name, formProps, required, ...formControlProps } = props;

    return (
        <DateTimeStampInput
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

export default ControlledDateTimeStampInput;
