import { FC } from 'react';
import { Box, DialogContent, DialogContentText } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import { DuplicateFormProps } from '../../../utils/forms/DuplicateDialogFormUtils';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { useTheme } from '@mui/styles';

export type DuplicateDialogProps = DuplicateFormProps & {
    oldName: string;
    handleDialogClose: (checkChanges: boolean) => void;
    description: string;
};

const DuplicateDialogForm: FC<DuplicateDialogProps> = (props: DuplicateDialogProps) => {
    const theme = useTheme();

    return (
        <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={props.handleSubmit}
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
                <FormGqlError error={props.gqlError} />
                <ControlledTextInput
                    name="name"
                    label="New Name"
                    formProps={props}
                    sx={{
                        width: '100%',
                        margin: theme.spacing(2, 0, 1),
                    }}
                    required
                    autoFocus
                />
            </DialogContent>
            <DialogActionsWithCancel
                disableSubmit={props.isSubmitting}
                handleDialogClose={props.handleDialogClose}
                confirmText={props.submitText}
                ignoreChanges
            />
        </Box>
    );
};

export default DuplicateDialogForm;
