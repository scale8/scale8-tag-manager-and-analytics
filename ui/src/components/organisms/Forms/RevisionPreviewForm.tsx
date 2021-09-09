import { FC } from 'react';
import { DialogContent, DialogContentText } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { FormProps } from '../../../hooks/form/useFormValidation';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { RevisionPreviewValues } from '../../../dialogPages/tagManager/app/AppRevisionPreview';

const useStyles = makeStyles((theme) =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
            minWidth: '500px',
        },
        input: {
            width: '100%',
            margin: theme.spacing(0, 0, 3),
        },
    }),
);

type RevisionPreviewFormProps = FormProps<RevisionPreviewValues> & {
    environments: { name: string; url: string }[];
    handleDialogClose: (checkChanges: boolean) => void;
    description: string;
};

const RevisionPreviewForm: FC<RevisionPreviewFormProps> = (props: RevisionPreviewFormProps) => {
    const classes = useStyles();

    return (
        <form className={classes.form} onSubmit={props.handleSubmit}>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
                <FormGqlError error={props.gqlError} />
                {props.environments.length > 0 && (
                    <ControlledSelect
                        className={classes.input}
                        label="Environment"
                        name="environment"
                        values={[
                            { key: '', text: '-- None --' },
                            ...props.environments.map((_) => ({
                                key: _.name,
                                text: _.name,
                            })),
                        ]}
                        formProps={props}
                    />
                )}
                <ControlledTextInput
                    name="url"
                    label="App URL"
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

export default RevisionPreviewForm;
