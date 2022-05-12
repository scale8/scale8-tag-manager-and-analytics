import { FC } from 'react';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { Box, DialogContent } from '@mui/material';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { OrgTransferOwnershipFormProps } from '../../../types/props/forms/OrgTransferOwnershipFormProps';
import FormGqlError from '../../atoms/FormGqlError';
import { Alert } from '@mui/material';
import FormFlex from '../../atoms/FormFlex';

const UserSelect: FC<OrgTransferOwnershipFormProps> = (props: OrgTransferOwnershipFormProps) => {
    const notAvailable = props.viableUsers.length < 1;

    if (notAvailable) {
        return (
            <Box width={320}>
                <Alert severity="info">
                    There are no viable users for ownership transfer. You must have at least another
                    admin in the Organization.
                </Alert>
            </Box>
        );
    }

    return (
        <ControlledSelect
            className="DialogFormField"
            label="New Owner"
            name="userId"
            values={props.viableUsers}
            formProps={props}
            required
        />
    );
};

const OrgTransferOwnershipForm: FC<OrgTransferOwnershipFormProps> = (
    props: OrgTransferOwnershipFormProps,
) => {
    const notAvailable = props.viableUsers.length < 1;

    return (
        <Box
            sx={{
                minWidth: '400px',
                padding: (theme) => theme.spacing(2, 2, 1, 2),
            }}
        >
            <FormFlex handleSubmit={props.handleSubmit}>
                <DialogContent>
                    <FormGqlError error={props.gqlError} width={320} />
                    <UserSelect {...props} />
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

export default OrgTransferOwnershipForm;
