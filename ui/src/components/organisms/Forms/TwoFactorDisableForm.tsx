import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import {
    TwoFactorDisableFormProps,
    TwoFactorDisableValues,
} from '../../../dialogPages/global/TwoFactorDisable';
import FormFlex from '../../atoms/FormFlex';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const TwoFactorDisableForm: FC<TwoFactorDisableFormProps> = (props: TwoFactorDisableFormProps) => {
    return (
        <DialogFormContextProvider<TwoFactorDisableValues> formProps={props}>
            <Box display="flex" flexDirection="column">
                <FormFlex handleSubmit={props.handleSubmit}>
                    <DialogContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '248px',
                        }}
                    >
                        <small>
                            Enter the 6-digit code from the app to confirm.
                            <br />
                            <br />
                        </small>
                        <Box width={150}>
                            <FormGqlError error={props.gqlError} fullWidth={true} />
                            <DialogFormTextInput
                                name="code"
                                label="Code"
                                outlined
                                fullWidth
                                autoFocus
                            />
                        </Box>
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

export default TwoFactorDisableForm;
