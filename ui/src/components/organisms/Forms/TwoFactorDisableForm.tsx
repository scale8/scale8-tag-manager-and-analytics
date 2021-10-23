import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { TwoFactorDisableFormProps } from '../../../dialogPages/global/TwoFactorDisable';
import FormFlex from '../../atoms/FormFlex';

const TwoFactorDisableForm: FC<TwoFactorDisableFormProps> = (props: TwoFactorDisableFormProps) => {
    return (
        <Box display="flex" flexDirection="column">
            <FormFlex handleSubmit={props.handleSubmit}>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '248px',
                    }}
                >
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
                            className="DrawerFormField"
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
            </FormFlex>
        </Box>
    );
};

export default TwoFactorDisableForm;
