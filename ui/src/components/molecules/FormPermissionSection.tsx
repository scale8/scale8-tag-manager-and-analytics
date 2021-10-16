import { ReactElement } from 'react';
import { Box, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import ControlledSwitch from '../atoms/ControlledInputs/ControlledSwitch';
import { FormProps } from '../../hooks/form/useFormValidation';

const FormPermissionSection = <Values extends { [key: string]: any }>(props: {
    formProps: FormProps<Values>;
}): ReactElement => {
    const formValues = props.formProps.values;

    return (
        <Box mt={1} p={2} border={1} borderColor="#e0e0e0">
            <Box color="#9e9e9e" bgcolor="#ffffff" position="absolute" mt="-29px" ml="-5px" px={1}>
                User Permissions
            </Box>
            <FormControl component="fieldset">
                <FormGroup>
                    <FormControlLabel
                        control={
                            <ControlledSwitch
                                name="permissionsCanView"
                                formProps={props.formProps}
                                disabled={true}
                            />
                        }
                        label="Can View"
                    />
                    <FormControlLabel
                        control={
                            <ControlledSwitch
                                name="permissionsCanCreate"
                                formProps={props.formProps}
                                disabled={formValues.permissionsIsAdmin}
                            />
                        }
                        label="Can Create"
                    />
                    <FormControlLabel
                        control={
                            <ControlledSwitch
                                name="permissionsCanEdit"
                                formProps={props.formProps}
                                disabled={formValues.permissionsIsAdmin}
                            />
                        }
                        label="Can Edit"
                    />
                    <FormControlLabel
                        control={
                            <ControlledSwitch
                                name="permissionsCanDelete"
                                formProps={props.formProps}
                                disabled={formValues.permissionsIsAdmin}
                            />
                        }
                        label="Can Delete"
                    />
                    <FormControlLabel
                        control={
                            <ControlledSwitch
                                name="permissionsIsAdmin"
                                formProps={props.formProps}
                            />
                        }
                        label="Is Admin"
                    />
                </FormGroup>
            </FormControl>
        </Box>
    );
};

export default FormPermissionSection;
