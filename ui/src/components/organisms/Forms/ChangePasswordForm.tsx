import { FC } from 'react';
import { Box, DialogContent, Link } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { toRequestPasswordReset } from '../../../utils/NavigationPaths';
import { ChangePasswordFormProps } from '../../../dialogPages/global/ChangePassword';
import FormFlex from '../../atoms/FormFlex';

const ChangePasswordForm: FC<ChangePasswordFormProps> = (props: ChangePasswordFormProps) => {
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

                    <ControlledTextInput
                        name="oldPassword"
                        label="Old Password"
                        formProps={props}
                        className="DialogFormField"
                        required
                        inputProps={{
                            autoComplete: 'password',
                        }}
                        type="password"
                        autoFocus
                    />
                    <ControlledTextInput
                        name="newPassword"
                        label="New Password"
                        formProps={props}
                        className="DialogFormField"
                        required
                        inputProps={{
                            autoComplete: 'new-password',
                        }}
                        type="password"
                    />
                    <ControlledTextInput
                        name="newPasswordConfirm"
                        label="Confirm New Password"
                        formProps={props}
                        className="DialogFormField"
                        required
                        inputProps={{
                            autoComplete: 'new-password',
                        }}
                        type="password"
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

export default ChangePasswordForm;
