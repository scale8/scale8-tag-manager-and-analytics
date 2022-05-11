import { FC } from 'react';
import { AppRevisionDeployFormProps } from '../../../utils/forms/AppRevisionDeployDialogFormUtils';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { Box, DialogContent } from '@mui/material';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import FormFlex from '../../atoms/FormFlex';

const EnvironmentSelect: FC<AppRevisionDeployFormProps> = (props: AppRevisionDeployFormProps) => {
    const notAvailable = props.availableEnvironments.length < 1;

    if (notAvailable) {
        return <small>Already deployed to all available environments.</small>;
    }

    return (
        <ControlledSelect
            className="DialogFormField"
            label="Environment"
            name="environmentId"
            values={props.availableEnvironments}
            formProps={props}
            required
        />
    );
};

const AppRevisionDeployForm: FC<AppRevisionDeployFormProps> = (
    props: AppRevisionDeployFormProps,
) => {
    const notAvailable = props.availableEnvironments.length < 1;

    return (
        <Box
            sx={{
                minWidth: '400px',
                padding: (theme) => theme.spacing(0, 2, 1, 2),
            }}
        >
            <FormFlex handleSubmit={props.handleSubmit}>
                <DialogContent>
                    <EnvironmentSelect {...props} />
                </DialogContent>
                <DialogActionsWithCancel
                    disableSubmit={props.isSubmitting || notAvailable}
                    handleDialogClose={props.handleDialogClose}
                    confirmText={props.submitText}
                    ignoreChanges
                />
            </FormFlex>
        </Box>
    );
};

export default AppRevisionDeployForm;
