import { FC } from 'react';
import { Box, Button } from '@mui/material';
import FormError from '../../atoms/FormError';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import FormTitle from '../../molecules/FormTitle';
import { SetupFormProps } from '../../../types/props/forms/SetupFormProps';
import FormFull from '../../atoms/FormFull';

const SetupForm: FC<SetupFormProps> = (props: SetupFormProps) => {
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

            <FormFull handleSubmit={props.handleSubmit}>
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
                    className="formFullMainColorSubmit"
                    disabled={props.isSubmitting}
                >
                    {props.submitText}
                </Button>
            </FormFull>
        </LoggedOutFormContainer>
    );
};

export default SetupForm;
