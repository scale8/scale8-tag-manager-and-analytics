import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { Box, FormControlLabel } from '@material-ui/core';
import ControlledSwitch from '../../atoms/ControlledInputs/ControlledSwitch';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { NotificationsSettingsFormProps } from '../../../dialogPages/global/NotificationsSettings';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
}));

const NotificationSettingsForm: FC<NotificationsSettingsFormProps> = (
    props: NotificationsSettingsFormProps,
) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <FormGqlError error={props.gqlError} />
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <Box height="328px">
                    <FormControlLabel
                        control={<ControlledSwitch name="emailNotifications" formProps={props} />}
                        label="Receive a notification alert via e-mail"
                    />
                </Box>
                <DialogActionsWithCancel
                    disableSubmit={props.isSubmitting}
                    handleDialogClose={props.handleDialogClose}
                    confirmText={props.submitText}
                />
            </form>
        </Box>
    );
};

export default NotificationSettingsForm;
