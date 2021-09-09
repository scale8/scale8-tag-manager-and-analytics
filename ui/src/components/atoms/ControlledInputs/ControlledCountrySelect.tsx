import { ReactElement } from 'react';
import { ControlledInputProps } from '../../../hooks/form/useFormValidation';
import CountrySelect from '../InputTypes/CountrySelect';

const ControlledCountrySelect = <T extends { [key: string]: any }>(
    props: ControlledInputProps<T>,
): ReactElement => {
    const { name, formProps, ...textFieldProps } = props;

    return (
        <CountrySelect
            name={name}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            {...textFieldProps}
            label="Country"
        />
    );
};

export default ControlledCountrySelect;
