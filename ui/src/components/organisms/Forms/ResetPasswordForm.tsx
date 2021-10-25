import { FC } from 'react';
import { Box, Button } from '@mui/material';
import FormTitle from '../../molecules/FormTitle';
import FormError from '../../atoms/FormError';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import { ResetPasswordFormProps } from '../../../types/props/forms/ResetPasswordFormProps';
import FormFull from '../../atoms/FormFull';

const ResetPasswordForm: FC<ResetPasswordFormProps> = (props: ResetPasswordFormProps) => {
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
            <FormFull handleSubmit={props.handleSubmit}>
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
                    className="formFullMainColorSubmit"
                    disabled={props.isSubmitting}
                >
                    {props.submitText}
                </Button>
            </FormFull>
        </LoggedOutFormContainer>
    );
};

export default ResetPasswordForm;
