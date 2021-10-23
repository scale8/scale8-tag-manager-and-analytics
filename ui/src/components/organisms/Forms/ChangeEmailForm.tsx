import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { ChangeEmailProps } from '../../../dialogPages/global/ChangeEmail';
import FormFlex from '../../atoms/FormFlex';

const ChangeEmailForm: FC<ChangeEmailProps> = (props: ChangeEmailProps) => {
    return (
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
                    <ControlledTextInput
                        name="email"
                        label="Email"
                        formProps={props}
                        className="DrawerFormField"
                        required
                    />
                    <ControlledTextInput
                        name="confirmEmail"
                        label="Confirm Email"
                        formProps={props}
                        className="DrawerFormField"
                        required
                    />
                </DialogContent>
                <DialogActionsWithCancel
                    disableSubmit={props.isSubmitting}
                    handleDialogClose={props.handleDialogClose}
                    confirmText={props.submitText}
                />
            </FormFlex>
        </Box>
    );
};

export default ChangeEmailForm;
