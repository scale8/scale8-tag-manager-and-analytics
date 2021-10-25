import { FC } from 'react';
import { Box, Button } from '@mui/material';
import FormTitle from '../../molecules/FormTitle';
import FormError from '../../atoms/FormError';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import { RequestPasswordResetFormProps } from '../../../types/props/forms/PasswordResetFormProps';
import FormFull from '../../atoms/FormFull';

const RequestPasswordResetForm: FC<RequestPasswordResetFormProps> = (
    props: RequestPasswordResetFormProps,
) => {
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
            <FormFull handleSubmit={props.handleSubmit}>
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
                    className="formFullMainColorSubmit"
                    disabled={props.isSubmitting}
                >
                    {props.submitText}
                </Button>
            </FormFull>
        </LoggedOutFormContainer>
    );
};

export default RequestPasswordResetForm;
