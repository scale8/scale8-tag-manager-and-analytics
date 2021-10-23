import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { GitHubPreparationFormProps } from '../../../dialogPages/global/GithubAccount';
import FormFlex from '../../atoms/FormFlex';

const GithubPreparationForm: FC<GitHubPreparationFormProps> = (
    props: GitHubPreparationFormProps,
) => {
    return (
        <Box display="flex" flexDirection="column">
            <FormGqlError error={props.gqlError} />
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
                        className="DrawerFormField"
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
