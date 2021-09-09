import { FC, useState } from 'react';
import { Checkbox, FormControlLabel, useTheme } from '@material-ui/core';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { AWSRegion, StorageProvider } from '../../../gql/generated/globalTypes';
import ControlledBooleanSelect from '../../atoms/ControlledInputs/ControlledBooleanSelect';
import ControlledCodeInput from '../../atoms/ControlledInputs/ControlledCodeInput';
import { FormProps } from '../../../hooks/form/useFormValidation';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import BoxedInputs from '../../atoms/BoxedInputs';
import { IngestEndpointEnvironmentFormProps } from '../../../dialogPages/dataManager/IngestEndpointEnvironmentCreate';

const IngestEndpointEnvironmentForm: FC<IngestEndpointEnvironmentFormProps> = (
    props: IngestEndpointEnvironmentFormProps,
) => {
    const theme = useTheme();

    const [customDomain, setCustomDomain] = useState(
        (props.gqlError?.message ?? '').indexOf('Certificate') !== -1,
    );

    const awsRegionValues = Object.keys(AWSRegion).map((key) => ({
        key,
        text: AWSRegion[key as unknown as keyof typeof AWSRegion].toLowerCase().replace(/_/g, '-'),
    }));

    const storageProviderValues = Object.keys(StorageProvider).map((key) => ({
        key,
        text:
            key === StorageProvider.GC_BIGQUERY_STREAM
                ? 'Google Cloud BigQuery Stream'
                : StorageProvider[key as unknown as keyof typeof StorageProvider].replace(
                      /_/g,
                      ' ',
                  ),
    }));

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

            {props.isCreate && (
                <>
                    <ControlledSelect
                        className="DrawerFormField"
                        label="Storage Provider"
                        name="storageProvider"
                        values={storageProviderValues}
                        formProps={props}
                        required
                    />
                    {props.values.storageProvider === StorageProvider.AWS_S3 && (
                        <BoxedInputs label="AWS Storage Config">
                            <ControlledTextInput
                                name="bucketName"
                                label="Bucket Name"
                                formProps={props}
                                className="DrawerFormField"
                                required
                            />
                            <ControlledTextInput
                                name="accessKeyId"
                                label="Access Key Id"
                                formProps={props}
                                className="DrawerFormField"
                                required
                            />
                            <ControlledTextInput
                                name="secretAccessKey"
                                label="Secret Access Key"
                                formProps={props}
                                className="DrawerFormField"
                                required
                            />
                            <ControlledSelect
                                className="DrawerFormField"
                                label="Region"
                                name="region"
                                values={awsRegionValues}
                                formProps={props}
                                required
                            />
                            <ControlledTextInput
                                name="pathPrefix"
                                label="Path Prefix"
                                formProps={props}
                                className="DrawerFormField"
                            />
                        </BoxedInputs>
                    )}
                    {props.values.storageProvider === StorageProvider.GC_BIGQUERY_STREAM && (
                        <BoxedInputs label="Google Cloud BigQuery Stream Config">
                            <ControlledCodeInput
                                name="serviceAccountJSON"
                                label="Service Account Config"
                                formProps={
                                    props as unknown as FormProps<{
                                        [key: string]: any;
                                    }>
                                }
                                mode="json"
                                required
                            />
                            <ControlledTextInput
                                name="dataSetName"
                                label="Data Set Name"
                                formProps={props}
                                className="DrawerFormField"
                                required
                            />
                            <ControlledBooleanSelect
                                className="DrawerFormField"
                                label="Require partition filter in queries"
                                name="requirePartitionFilterInQueries"
                                formProps={props}
                                required
                            />
                        </BoxedInputs>
                    )}
                </>
            )}
        </DrawerFormLayout>
    );
};

export default IngestEndpointEnvironmentForm;
