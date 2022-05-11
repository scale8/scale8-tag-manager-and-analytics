import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import {
    GitHubPreparationFormProps,
    GitHubPreparationValues,
} from '../../../dialogPages/global/GithubAccount';
import FormFlex from '../../atoms/FormFlex';
import FormError from '../../atoms/FormError';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const GithubPreparationForm: FC<GitHubPreparationFormProps> = (
    props: GitHubPreparationFormProps,
) => {
    return (
        <DialogFormContextProvider<GitHubPreparationValues> formProps={props}>
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
                        <DialogFormTextInput name="githubUser" label="GitHub User" autoFocus />
                    </DialogContent>
                    <DialogActionsWithCancel
                        disableSubmit={props.isSubmitting}
                        handleDialogClose={props.handleDialogClose}
                        confirmText={props.submitText}
                    />
                </FormFlex>
            </Box>
        </DialogFormContextProvider>
    );
};

export default GithubPreparationForm;
