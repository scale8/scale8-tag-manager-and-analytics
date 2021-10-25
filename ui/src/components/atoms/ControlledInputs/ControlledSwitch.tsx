import { ChangeEvent, ReactElement } from 'react';
import { Switch } from '@mui/material';
import { ControlledSwitchProps } from '../../../hooks/form/useFormValidation';

const ControlledSwitch = <T extends { [key: string]: any }>(
    props: ControlledSwitchProps<T>,
): ReactElement => {
    const { name, formProps, ...switchProps } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        formProps.handleChange(name, event.target.checked);

    return (
        <Switch
            name={name}
            checked={formProps.values[name]}
            onChange={handleChange}
            {...switchProps}
        />
    );
};

export default ControlledSwitch;
