import { FC } from 'react';
import { Box } from '@mui/material';
import EnvironmentVariablesInput from '../../atoms/EnvironmentVariablesInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { EnvironmentFormProps } from '../../../dialogPages/tagManager/app/EnvironmentCreate';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { EnvironmentValues } from '../../../utils/forms/EnvironmentFormUtils';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';

const EnvironmentForm: FC<EnvironmentFormProps> = (props: EnvironmentFormProps) => {
    return (
        <DialogFormContextProvider<EnvironmentValues> formProps={props}>
            <DrawerFormLayout
                {...props}
                submitDisable={props.isSubmitting || props.availableRevisions.length < 1}
            >
                <DialogFormTextInput name="name" label="Name" autoFocus />
                <DialogFormTextInput name="url" label="URL" optional />
                {props.availableRevisions.length < 1 && (
                    <small>
                        At least one revision needs to be finalised for it to be attached to an
                        environment.
                    </small>
                )}
                <DialogFormSelect
                    label="Revision"
                    name="revisionId"
                    values={props.availableRevisions}
                    disabled={props.availableRevisions.length < 1}
                />

                {props.values.variables !== undefined && (
                    <Box mb={3}>
                        <EnvironmentVariablesInput
                            label="Environment Variables"
                            values={props.values.variables}
                            add={(key: string, value: string) => {
                                props.handleChange('variables', [
                                    ...(props.values.variables ?? []),
                                    { key, value },
                                ]);
                            }}
                            remove={(key: string) => {
                                props.handleChange(
                                    'variables',
                                    props.values.variables?.filter((_) => _.key !== key),
                                );
                            }}
                        />
                    </Box>
                )}
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default EnvironmentForm;
