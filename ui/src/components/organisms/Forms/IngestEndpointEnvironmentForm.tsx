import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointEnvironmentFormProps } from '../../../dialogPages/dataManager/IngestEndpointEnvironmentCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';

const IngestEndpointEnvironmentForm: FC<IngestEndpointEnvironmentFormProps> = (
    props: IngestEndpointEnvironmentFormProps,
) => {
    return (
        <DrawerFormLayout
            {...props}
            submitDisable={props.isSubmitting || props.availableRevisions.length < 1}
        >
            <ControlledTextInput
                name="name"
                label="Name"
                formProps={props}
                className="DrawerFormField"
                required
                autoFocus
            />

            {props.availableRevisions.length < 1 && (
                <small>
                    At least one revision needs to be finalised for it to be attached to an
                    environment.
                </small>
            )}

            <ControlledSelect
                className="DrawerFormField"
                label="Revision"
                name="revisionId"
                values={props.availableRevisions}
                formProps={props}
                disabled={props.availableRevisions.length < 1}
                required
            />

            <StorageProviderSelector {...props} includeBigQueryPartitionFilter />
        </DrawerFormLayout>
    );
};

export default IngestEndpointEnvironmentForm;
