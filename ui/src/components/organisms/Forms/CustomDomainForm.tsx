import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { Alert, Box } from '@mui/material';
import { CustomDomainFormProps } from '../../../utils/forms/CustomDomainFormUtils';

const CustomDomainForm: FC<CustomDomainFormProps> = (props: CustomDomainFormProps) => {
    return (
        <DrawerFormLayout {...props}>
            <Box pb={2}>
                <Alert severity="warning">
                    Please make sure you have created a CNAME record with your custom domain pointed
                    at <strong>{props.installDomain}</strong> before proceeding.
                </Alert>
            </Box>

            <ControlledTextInput
                name="domain"
                label="Domain"
                formProps={props}
                className="DrawerFormField"
                required
            />
            <ControlledTextAreaInput
                maxRows={5}
                name="certificate"
                label="Certificate (pem)"
                formProps={props}
                className="DrawerFormField"
                required
            />
            <ControlledTextAreaInput
                maxRows={5}
                name="key"
                label="Key (pem)"
                formProps={props}
                className="DrawerFormField"
                required
            />
        </DrawerFormLayout>
    );
};

export default CustomDomainForm;
