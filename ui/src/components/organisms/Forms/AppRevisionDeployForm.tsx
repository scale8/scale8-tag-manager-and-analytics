import { FC } from 'react';
import { AppRevisionDeployFormProps } from '../../../utils/forms/AppRevisionDeployDialogFormUtils';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { DialogContent } from '@mui/material';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            minWidth: '400px',
            padding: theme.spacing(0, 2, 1, 2),
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

const EnvironmentSelect: FC<AppRevisionDeployFormProps> = (props: AppRevisionDeployFormProps) => {
    const notAvailable = props.availableEnvironments.length < 1;

    if (notAvailable) {
        return <small>Already deployed to all available environments.</small>;
    }

    return (
        <ControlledSelect
            className="DrawerFormField"
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
    const classes = useStyles();
    const notAvailable = props.availableEnvironments.length < 1;

    return (
        <div className={classes.root}>
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <DialogContent>
                    <EnvironmentSelect {...props} />
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

export default AppRevisionDeployForm;
