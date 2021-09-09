import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, DialogContent } from '@material-ui/core';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { TwoFactorDisableFormProps } from '../../../dialogPages/global/TwoFactorDisable';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    resetPasswordLink: {
        color: theme.palette.common.black,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '248px',
    },
}));

const TwoFactorDisableForm: FC<TwoFactorDisableFormProps> = (props: TwoFactorDisableFormProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <small>
                        Enter the 6-digit code from the app to confirm.
                        <br />
                        <br />
                    </small>
                    <Box width={150}>
                        <FormGqlError error={props.gqlError} fullWidth={true} />
                        <ControlledTextInput
                            variant="outlined"
                            name="code"
                            label="Code"
                            formProps={props}
                            className={classes.input}
                            required
                            fullWidth
                            autoFocus
                        />
                    </Box>
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

export default TwoFactorDisableForm;
