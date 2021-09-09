import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, Button } from '@material-ui/core';
import FormTitle from '../../molecules/FormTitle';
import FormError from '../../atoms/FormError';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import { RequestPasswordResetFormProps } from '../../../types/props/forms/PasswordResetFormProps';

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

const RequestPasswordResetForm: FC<RequestPasswordResetFormProps> = (
    props: RequestPasswordResetFormProps,
) => {
    const classes = useStyles();

    return (
        <LoggedOutFormContainer>
            <Box mb={2}>
                <FormTitle title="Reset your password?" />
            </Box>
            {props.gqlError && (
                <Box mb={2} width="100%">
                    <FormError error={props.gqlError.message} />
                </Box>
            )}
            <form className={classes.form} onSubmit={props.handleSubmit}>
                {!props.fixedEmail && (
                    <>
                        Please provide the email address that you used when you signed up for your
                        account. <br />
                        <br />
                    </>
                )}
                We will send you an email that will allow you to reset your password.
                <br />
                <br />
                <ControlledTextInput
                    name="email"
                    label="Email Address"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    disabled={props.fixedEmail}
                    required
                    fullWidth
                    autoFocus
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

export default RequestPasswordResetForm;
