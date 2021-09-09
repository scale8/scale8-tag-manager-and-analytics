import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, Button } from '@material-ui/core';
import FormError from '../../atoms/FormError';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import FormTitle from '../../molecules/FormTitle';
import { SetupFormProps } from '../../../types/props/forms/SetupFormProps';

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

const SetupForm: FC<SetupFormProps> = (props: SetupFormProps) => {
    const classes = useStyles();

    return (
        <LoggedOutFormContainer>
            <Box mb={2}>
                <FormTitle title="Setup" />
            </Box>
            {props.gqlError && (
                <Box mb={2} width="100%">
                    <FormError error={props.gqlError.message} />
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
                    name="newPassword"
                    label="New Password"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    inputProps={{
                        autoComplete: 'new-password',
                    }}
                    type="password"
                />
                <ControlledTextInput
                    name="newPasswordConfirm"
                    label="Confirm New Password"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    inputProps={{
                        autoComplete: 'new-password',
                    }}
                    type="password"
                />
                <ControlledTextInput
                    name="orgName"
                    label="Organization name"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />
                <ControlledTextInput
                    name="firstName"
                    label="First Name"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />
                <ControlledTextInput
                    name="lastName"
                    label="Last Name"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
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

export default SetupForm;
