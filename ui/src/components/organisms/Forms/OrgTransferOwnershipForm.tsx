import { FC } from 'react';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { Box, DialogContent } from '@material-ui/core';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { OrgTransferOwnershipFormProps } from '../../../types/props/forms/OrgTransferOwnershipFormProps';
import FormGqlError from '../../atoms/FormGqlError';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            minWidth: '400px',
            padding: theme.spacing(2, 2, 1, 2),
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            '& .DrawerFormField': {
                width: '100%',
                margin: theme.spacing(0, 0, 3),
            },
        },
    }),
);

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
            className="DrawerFormField"
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
    const classes = useStyles();
    const notAvailable = props.viableUsers.length < 1;

    return (
        <div className={classes.root}>
            <form className={classes.form} onSubmit={props.handleSubmit}>
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
            </form>
        </div>
    );
};

export default OrgTransferOwnershipForm;
