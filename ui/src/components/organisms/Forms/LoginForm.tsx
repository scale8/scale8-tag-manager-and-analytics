import makeStyles from '@mui/styles/makeStyles';
import { FC } from 'react';
import { Box, Button } from '@mui/material';
import FormTitle from '../../molecules/FormTitle';
import FormError from '../../atoms/FormError';
import LoginLinks from '../../molecules/LoginLinks';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import LoginSso from '../../molecules/LoginSso';
import Link from '../../atoms/Next/Link';
import { LoginFormProps } from '../../../types/props/forms/LoginFormProps';
import { useConfigState } from '../../../context/AppContext';
import { toRequestPasswordReset } from '../../../utils/NavigationPaths';

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

const LoginForm: FC<LoginFormProps> = (props: LoginFormProps) => {
    const classes = useStyles();

    const { useGithubSSO } = useConfigState();

    return (
        <LoggedOutFormContainer>
            <Box mb={2}>
                <FormTitle title="Sign in" />
            </Box>
            {props.ssoError !== '' && (
                <Box mb={2} width="100%">
                    <FormError error={props.ssoError} />
                </Box>
            )}
            {props.gqlError && (
                <Box mb={2} width="100%">
                    <FormError error={props.gqlError.message} />
                </Box>
            )}
            {props.reason === 'duplicate' && (
                <Box mb={2} width="100%">
                    <Box fontSize={18} width="100%" textAlign="center">
                        You already have an account with us.
                    </Box>
                    <Box fontSize={18} width="100%" textAlign="center">
                        Please log in or{' '}
                        <Link
                            href={toRequestPasswordReset()}
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                        >
                            reset you password
                        </Link>{' '}
                        if needed.
                    </Box>
                </Box>
            )}

            <form className={classes.form} onSubmit={props.handleSubmit}>
                <ControlledTextInput
                    name="email"
                    label="Email Address"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    inputProps={{
                        autoComplete: 'email',
                    }}
                    required
                    fullWidth
                    autoFocus
                />
                <ControlledTextInput
                    name="password"
                    label="Password"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    type="password"
                    inputProps={{
                        autoComplete: 'password',
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
            <LoginLinks />
            {useGithubSSO && <LoginSso handleGithubButtonClick={props.handleGithubButtonClick} />}
        </LoggedOutFormContainer>
    );
};

export default LoginForm;
