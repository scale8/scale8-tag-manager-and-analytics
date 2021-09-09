import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, Button } from '@material-ui/core';
import FormTitle from '../../molecules/FormTitle';
import FormError from '../../atoms/FormError';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import { ResetPasswordFormProps } from '../../../types/props/forms/ResetPasswordFormProps';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: '#ffffff',
        backgroundColor: theme.palette.commonColor.main,
        '&:hover': {
            color: '#ffffff',
            backgroundColor: theme.palette.commonColor.main,
        },
    },
}));

const ResetPasswordForm: FC<ResetPasswordFormProps> = (props: ResetPasswordFormProps) => {
    const classes = useStyles();

    return (
        <LoggedOutFormContainer>
            <Box mb={2}>
                <FormTitle title="Reset password" />
            </Box>
            {props.gqlError && (
                <Box mb={2} width="100%">
                    <FormError error={props.gqlError.message} />
                </Box>
            )}
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <ControlledTextInput
                    name="newPassword"
                    label="New Password"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    type="password"
                    inputProps={{
                        autoComplete: 'new-password',
                    }}
                    required
                    fullWidth
                />
                <ControlledTextInput
                    name="newPasswordConfirm"
                    label="Confirm New Password"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    type="password"
                    inputProps={{
                        autoComplete: 'new-password',
                    }}
                    required
                    fullWidth
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={props.isSubmitting}
                >
                    {props.submitText}
                </Button>
            </form>
        </LoggedOutFormContainer>
    );
};

export default ResetPasswordForm;
