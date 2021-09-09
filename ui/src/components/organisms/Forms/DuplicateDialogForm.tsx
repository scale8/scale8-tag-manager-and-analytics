import { FC } from 'react';
import { DialogContent, DialogContentText } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import { DuplicateFormProps } from '../../../utils/forms/DuplicateDialogFormUtils';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2, 1, 2),
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        input: {
            width: '100%',
            margin: theme.spacing(0, 0, 3),
        },
    }),
);

export type DuplicateDialogProps = DuplicateFormProps & {
    oldName: string;
    handleDialogClose: (checkChanges: boolean) => void;
    description: string;
};

const DuplicateDialogForm: FC<DuplicateDialogProps> = (props: DuplicateDialogProps) => {
    const classes = useStyles();

    return (
        <form className={classes.form} onSubmit={props.handleSubmit}>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
                <FormGqlError error={props.gqlError} />
                <ControlledTextInput
                    name="name"
                    label="New Name"
                    formProps={props}
                    className={classes.input}
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
        </form>
    );
};

export default DuplicateDialogForm;
