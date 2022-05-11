import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { ChangeEmailProps, ChangeEmailValues } from '../../../dialogPages/global/ChangeEmail';
import FormFlex from '../../atoms/FormFlex';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const ChangeEmailForm: FC<ChangeEmailProps> = (props: ChangeEmailProps) => {
    return (
        <DialogFormContextProvider<ChangeEmailValues> formProps={props}>
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
                        <DialogFormTextInput name="email" label="Email" />
                        <DialogFormTextInput name="confirmEmail" label="Confirm Email" />
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

export default ChangeEmailForm;
