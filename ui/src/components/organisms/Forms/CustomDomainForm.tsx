import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { Alert, Box } from '@mui/material';
import {
    CustomDomainFormProps,
    CustomDomainValues,
} from '../../../utils/forms/CustomDomainFormUtils';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';

const CustomDomainForm: FC<CustomDomainFormProps> = (props: CustomDomainFormProps) => {
    return (
        <DialogFormContextProvider<CustomDomainValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <Box pb={2}>
                    <Alert severity="warning">
                        Please make sure you have created a CNAME record with your custom domain
                        pointed at <strong>{props.cname}</strong> before proceeding.
                    </Alert>
                </Box>
                <DialogFormTextInput name="domain" label="Domain" />
                <DialogFormTextAreaInput maxRows={5} name="certificate" label="Certificate (pem)" />
                <DialogFormTextAreaInput maxRows={5} name="key" label="Key (pem)" />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default CustomDomainForm;
