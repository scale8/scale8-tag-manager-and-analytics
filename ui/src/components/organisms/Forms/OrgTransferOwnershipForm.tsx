import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import {
    OrgTransferOwnershipFormProps,
    OrgTransferOwnershipValues,
} from '../../../types/props/forms/OrgTransferOwnershipFormProps';
import FormGqlError from '../../atoms/FormGqlError';
import { Alert } from '@mui/material';
import FormFlex from '../../atoms/FormFlex';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';

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

    return <DialogFormSelect label="New Owner" name="userId" values={props.viableUsers} />;
};

const OrgTransferOwnershipForm: FC<OrgTransferOwnershipFormProps> = (
    props: OrgTransferOwnershipFormProps,
) => {
    const notAvailable = props.viableUsers.length < 1;

    return (
        <DialogFormContextProvider<OrgTransferOwnershipValues> formProps={props}>
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
        </DialogFormContextProvider>
    );
};

export default OrgTransferOwnershipForm;
