import { FC } from 'react';
import { Box, DialogContent, Link } from '@mui/material';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { toRequestPasswordReset } from '../../../utils/NavigationPaths';
import {
    ChangePasswordFormProps,
    ChangePasswordValues,
} from '../../../dialogPages/global/ChangePassword';
import FormFlex from '../../atoms/FormFlex';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const ChangePasswordForm: FC<ChangePasswordFormProps> = (props: ChangePasswordFormProps) => {
    return (
        <DialogFormContextProvider<ChangePasswordValues> formProps={props}>
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
                        {props.hasLinkedSSO && (
                            <small>
                                If you never set the password please click{' '}
                                <Link
                                    sx={{
                                        color: (theme) => theme.palette.common.black,
                                        fontWeight: 'bold',
                                    }}
                                    href={toRequestPasswordReset({ email: props.email })}
                                >
                                    here
                                </Link>{' '}
                                to create one.
                                <br />
                                <br />
                            </small>
                        )}
                        <DialogFormTextInput
                            name="oldPassword"
                            label="Old Password"
                            password
                            autoFocus
                        />
                        <DialogFormTextInput name="newPassword" label="New Password" newPassword />
                        <DialogFormTextInput
                            name="newPasswordConfirm"
                            label="Confirm New Password"
                            newPassword
                        />
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

export default ChangePasswordForm;
