import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, DialogContent } from '@material-ui/core';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { toRequestPasswordReset } from '../../../utils/NavigationPaths';
import { ChangePasswordFormProps } from '../../../dialogPages/global/ChangePassword';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '248px',
    },
    resetPasswordLink: {
        color: theme.palette.common.black,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
}));

const ChangePasswordForm: FC<ChangePasswordFormProps> = (props: ChangePasswordFormProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <FormGqlError error={props.gqlError} />
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    {props.hasLinkedSSO && (
                        <small>
                            If you never set the password please click{' '}
                            <a
                                className={classes.resetPasswordLink}
                                href={toRequestPasswordReset({ email: props.email })}
                            >
                                here
                            </a>{' '}
                            to create one.
                            <br />
                            <br />
                        </small>
                    )}

                    <ControlledTextInput
                        name="oldPassword"
                        label="Old Password"
                        formProps={props}
                        className={classes.input}
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
                        className={classes.input}
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
                        className={classes.input}
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
            </form>
        </Box>
    );
};

export default ChangePasswordForm;
