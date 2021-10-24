import { FC } from 'react';
import { Box, FormControlLabel } from '@mui/material';
import ControlledSwitch from '../../atoms/ControlledInputs/ControlledSwitch';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { NotificationsSettingsFormProps } from '../../../dialogPages/global/NotificationsSettings';
import FormFlex from '../../atoms/FormFlex';

const NotificationSettingsForm: FC<NotificationsSettingsFormProps> = (
    props: NotificationsSettingsFormProps,
) => {
    return (
        <Box display="flex" flexDirection="column">
            <FormGqlError error={props.gqlError} />
            <FormFlex handleSubmit={props.handleSubmit}>
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
            </FormFlex>
        </Box>
    );
};

export default NotificationSettingsForm;
