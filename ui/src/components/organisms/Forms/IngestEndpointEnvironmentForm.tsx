import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    IngestEndpointEnvironmentFormProps,
    IngestEndpointEnvironmentValues,
} from '../../../dialogPages/dataManager/IngestEndpointEnvironmentCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';

const IngestEndpointEnvironmentForm: FC<IngestEndpointEnvironmentFormProps> = (
    props: IngestEndpointEnvironmentFormProps,
) => {
    return (
        <DialogFormContextProvider<IngestEndpointEnvironmentValues> formProps={props}>
            <DrawerFormLayout
                {...props}
                submitDisable={props.isSubmitting || props.availableRevisions.length < 1}
            >
                <DialogFormTextInput name="name" label="Name" autoFocus />

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

                <StorageProviderSelector {...props} includeBigQueryPartitionFilter />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default IngestEndpointEnvironmentForm;
