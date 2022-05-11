import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import {
    PersonalInfoFormProps,
    PersonalInfoValues,
} from '../../../dialogPages/global/PersonalInfoUpdate';
import FormFlex from '../../atoms/FormFlex';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const PersonalInfoForm: FC<PersonalInfoFormProps> = (props: PersonalInfoFormProps) => {
    return (
        <DialogFormContextProvider<PersonalInfoValues> formProps={props}>
            <Box display="flex" flexDirection="column">
                <FormGqlError error={props.gqlError} />
                <FormFlex handleSubmit={props.handleSubmit}>
                    <DialogContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '248px',
                        }}
                    >
                        <DialogFormTextInput name="firstName" label="First Name" />
                        <DialogFormTextInput name="lastName" label="Last Name" />
                    </DialogContent>
                    <DialogActionsWithCancel
                        disableSubmit={props.isSubmitting}
                        handleDialogClose={props.handleDialogClose}
                        confirmText={props.submitText}
                    />
                </FormFlex>
            </Box>
        </DialogFormContextProvider>
    );
};

export default PersonalInfoForm;
