import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { GitHubPreparationFormProps } from '../../../dialogPages/global/GithubAccount';
import FormFlex from '../../atoms/FormFlex';
import FormError from '../../atoms/FormError';

const GithubPreparationForm: FC<GitHubPreparationFormProps> = (
    props: GitHubPreparationFormProps,
) => {
    return (
        <Box display="flex" flexDirection="column">
            {props.ssoError !== '' && (
                <Box mb={2} width="100%">
                    <FormError error={props.ssoError} />
                </Box>
            )}
            <FormFlex handleSubmit={props.handleSubmit}>
                <DialogContent
                    sx={{
                        minHeight: '248px',
                    }}
                >
                    <ControlledTextInput
                        name="githubUser"
                        label="GitHub User"
                        formProps={props}
                        className="DialogFormField"
                        required
                        autoFocus
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

export default GithubPreparationForm;
