import makeStyles from '@mui/styles/makeStyles';
import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { PersonalInfoFormProps } from '../../../dialogPages/global/PersonalInfoUpdate';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '248px',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
}));

const PersonalInfoForm: FC<PersonalInfoFormProps> = (props: PersonalInfoFormProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <FormGqlError error={props.gqlError} />
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <ControlledTextInput
                        name="firstName"
                        label="First Name"
                        formProps={props}
                        className={classes.input}
                        required
                    />
                    <ControlledTextInput
                        name="lastName"
                        label="Last Name"
                        formProps={props}
                        className={classes.input}
                        required
                    />
                </DialogContent>
                <DialogActionsWithCancel
                    disableSubmit={props.isSubmitting}
                    handleDialogClose={props.handleDialogClose}
                    confirmText={props.submitText}
                />
            </form>
        </Box>
    );
};

export default PersonalInfoForm;
