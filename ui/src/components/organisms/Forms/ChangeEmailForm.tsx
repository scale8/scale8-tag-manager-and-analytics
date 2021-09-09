import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, DialogContent } from '@material-ui/core';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { ChangeEmailProps } from '../../../dialogPages/global/ChangeEmail';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '248px',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
}));

const ChangeEmailForm: FC<ChangeEmailProps> = (props: ChangeEmailProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <FormGqlError error={props.gqlError} />
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <ControlledTextInput
                        name="email"
                        label="Email"
                        formProps={props}
                        className={classes.input}
                        required
                    />
                    <ControlledTextInput
                        name="confirmEmail"
                        label="Confirm Email"
                        formProps={props}
                        className={classes.input}
                        required
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

export default ChangeEmailForm;
