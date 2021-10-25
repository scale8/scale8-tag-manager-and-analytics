import { FC } from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { FormProps } from '../../../hooks/form/useFormValidation';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { RevisionPreviewValues } from '../../../dialogPages/tagManager/app/AppRevisionPreview';
import FormFlex from '../../atoms/FormFlex';

type RevisionPreviewFormProps = FormProps<RevisionPreviewValues> & {
    environments: { name: string; url: string }[];
    handleDialogClose: (checkChanges: boolean) => void;
    description: string;
};

const RevisionPreviewForm: FC<RevisionPreviewFormProps> = (props: RevisionPreviewFormProps) => {
    return (
        <FormFlex handleSubmit={props.handleSubmit}>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
                <FormGqlError error={props.gqlError} />
                {props.environments.length > 0 && (
                    <ControlledSelect
                        className="DrawerFormField"
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
                    className="DrawerFormField"
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
        </FormFlex>
    );
};

export default RevisionPreviewForm;
