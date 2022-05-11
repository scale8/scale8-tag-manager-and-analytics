import { FC } from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import { FormProps } from '../../../hooks/form/useFormValidation';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { RevisionPreviewValues } from '../../../dialogPages/tagManager/app/AppRevisionPreview';
import FormFlex from '../../atoms/FormFlex';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

type RevisionPreviewFormProps = FormProps<RevisionPreviewValues> & {
    environments: { name: string; url: string }[];
    handleDialogClose: (checkChanges: boolean) => void;
    description: string;
};

const RevisionPreviewForm: FC<RevisionPreviewFormProps> = (props: RevisionPreviewFormProps) => {
    return (
        <DialogFormContextProvider<RevisionPreviewValues> formProps={props}>
            <FormFlex handleSubmit={props.handleSubmit}>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.description}
                    </DialogContentText>
                    <FormGqlError error={props.gqlError} />
                    {props.environments.length > 0 && (
                        <DialogFormSelect
                            label="Environment"
                            name="environment"
                            values={[
                                { key: '', text: '-- None --' },
                                ...props.environments.map((_) => ({
                                    key: _.name,
                                    text: _.name,
                                })),
                            ]}
                        />
                    )}
                    <DialogFormTextInput name="url" label="App URL" autoFocus />
                </DialogContent>
                <DialogActionsWithCancel
                    disableSubmit={props.isSubmitting}
                    handleDialogClose={props.handleDialogClose}
                    confirmText={props.submitText}
                    ignoreChanges
                />
            </FormFlex>
        </DialogFormContextProvider>
    );
};

export default RevisionPreviewForm;
