import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, DialogContent } from '@material-ui/core';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { GitHubPreparationFormProps } from '../../../dialogPages/global/GithubAccount';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
    submit: {
        margin: theme.spacing(4, 0, 2),
    },
    dialogContent: {
        minHeight: '248px',
    },
}));

const GithubPreparationForm: FC<GitHubPreparationFormProps> = (
    props: GitHubPreparationFormProps,
) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <FormGqlError error={props.gqlError} />
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <ControlledTextInput
                        name="githubUser"
                        label="GitHub User"
                        formProps={props}
                        className={classes.input}
                        required
                        autoFocus
                    />
                </DialogContent>
                <DialogActionsWithCancel
                    disableSubmit={props.isSubmitting}
                    handleDialogClose={props.handleDialogClose}
                    confirmText={props.submitText}
                />
            </form>
        </Box>
    );
};

export default GithubPreparationForm;
