import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { PersonalInfoFormProps } from '../../../dialogPages/global/PersonalInfoUpdate';
import FormFlex from '../../atoms/FormFlex';

const PersonalInfoForm: FC<PersonalInfoFormProps> = (props: PersonalInfoFormProps) => {
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
                    <ControlledTextInput
                        name="firstName"
                        label="First Name"
                        formProps={props}
                        className="DrawerFormField"
                        required
                    />
                    <ControlledTextInput
                        name="lastName"
                        label="Last Name"
                        formProps={props}
                        className="DrawerFormField"
                        required
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

export default PersonalInfoForm;
