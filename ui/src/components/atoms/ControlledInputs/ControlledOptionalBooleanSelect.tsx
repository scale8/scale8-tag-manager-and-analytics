import { ChangeEvent, ReactElement } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { ControlledBooleanSelectProps } from '../../../hooks/form/useFormValidation';

const ControlledOptionalBooleanSelect = <T extends { [key: string]: any }>(
    props: ControlledBooleanSelectProps<T>,
): ReactElement => {
    const { name, formProps, label, ...formControlProps } = props;

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        formProps.handleChange(
            name,
            event.target.value === '' ? '' : event.target.value === 'TRUE',
        );
    };

    return (
        <FormControl {...formControlProps}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={
                    formProps.values[name] === '' ? '' : formProps.values[name] ? 'TRUE' : 'FALSE'
                }
                onChange={handleChange}
                onBlur={formProps.handleBlur}
                name={name}
                error={!!formProps.errors[props.name]}
            >
                <MenuItem value="">--Not Set--</MenuItem>
                <MenuItem value="TRUE">True</MenuItem>
                <MenuItem value="FALSE">False</MenuItem>
            </Select>
        </FormControl>
    );
};

export default ControlledOptionalBooleanSelect;
