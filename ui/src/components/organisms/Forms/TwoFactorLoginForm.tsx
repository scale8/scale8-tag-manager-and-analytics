import { FC } from 'react';
import { Box, Button } from '@mui/material';
import FormTitle from '../../molecules/FormTitle';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import { TwoFactorLoginFormProps } from '../../../types/props/forms/LoginFormProps';
import FormFull from '../../atoms/FormFull';

const TwoFactorLoginForm: FC<TwoFactorLoginFormProps> = (props: TwoFactorLoginFormProps) => {
    return (
        <LoggedOutFormContainer>
            <Box mb={2}>
                <FormTitle title="Sign in" />
            </Box>
            <FormGqlError error={props.gqlError} fullWidth={true} />
            <FormFull handleSubmit={props.handleSubmit}>
                <small>
                    Two-factor authentication is enabled for your account. Enter your authentication
                    code to verify your identity.
                    <br />
                    <br />
                    Check your authentication app for your code.
                    <br />
                    <br />
                </small>
                <ControlledTextInput
                    variant="outlined"
                    name="code"
                    label="Code"
                    formProps={props}
                    required
                    fullWidth
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="formFullSubmit"
                    disabled={props.isSubmitting}
                >
                    {props.submitText}
                </Button>
            </FormFull>
        </LoggedOutFormContainer>
    );
};

export default TwoFactorLoginForm;
