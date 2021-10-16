import { FC, useState } from 'react';
import { Checkbox, FormControlLabel, useTheme } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointEnvironmentFormProps } from '../../../dialogPages/dataManager/IngestEndpointEnvironmentCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';

const IngestEndpointEnvironmentForm: FC<IngestEndpointEnvironmentFormProps> = (
    props: IngestEndpointEnvironmentFormProps,
) => {
    const theme = useTheme();

    const [customDomain, setCustomDomain] = useState(
        (props.gqlError?.message ?? '').indexOf('Certificate') !== -1,
    );

    return (
        <DrawerFormLayout {...props}>
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

            {props.hasCustomDomain === undefined && (
                <FormControlLabel
                    style={{ marginBottom: theme.spacing(1) }}
                    control={
                        <Checkbox
                            name="customDomain"
                            checked={customDomain}
                            onChange={(event) => {
                                if (!event.target.checked) {
                                    props.handleChange('domain', '');
                                }
                                setCustomDomain(event.target.checked);
                            }}
                            color="primary"
                        />
                    }
                    label="Custom Domain"
                />
            )}

            {customDomain && (
                <ControlledTextInput
                    name="domain"
                    label="Domain"
                    formProps={props}
                    className="DrawerFormField"
                    required
                />
            )}

            {(props.hasCustomDomain || customDomain) && (
                <>
                    <ControlledTextAreaInput
                        name="certificate"
                        label="Certificate (pem)"
                        formProps={props}
                        className="DrawerFormField"
                        required={!props.hasCustomDomain}
                    />

                    <ControlledTextAreaInput
                        name="key"
                        label="Key (pem)"
                        formProps={props}
                        className="DrawerFormField"
                        required={!props.hasCustomDomain}
                    />
                </>
            )}

            <StorageProviderSelector {...props} includeBigQueryPartitionFilter />
        </DrawerFormLayout>
    );
};

export default IngestEndpointEnvironmentForm;
