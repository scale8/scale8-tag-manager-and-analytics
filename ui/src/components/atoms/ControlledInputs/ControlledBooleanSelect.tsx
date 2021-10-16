import { ReactElement } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ControlledBooleanSelectProps } from '../../../hooks/form/useFormValidation';

const ControlledBooleanSelect = <T extends { [key: string]: any }>(
    props: ControlledBooleanSelectProps<T>,
): ReactElement => {
    const { name, formProps, label, ...formControlProps } = props;

    const handleChange = (event: SelectChangeEvent) => {
        formProps.handleChange(name, event.target.value === 'TRUE');
    };

    return (
        <FormControl {...formControlProps}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={formProps.values[name] ? 'TRUE' : 'FALSE'}
                onChange={handleChange}
                onBlur={formProps.handleBlur}
                name={name}
                error={!!formProps.errors[props.name]}
            >
                <MenuItem value="TRUE">True</MenuItem>
                <MenuItem value="FALSE">False</MenuItem>
            </Select>
        </FormControl>
    );
};

export default ControlledBooleanSelect;
