import { ReactElement } from 'react';
import ControlledSelect from '../atoms/ControlledInputs/ControlledSelect';
import { AWSRegion, Mode, StorageProvider } from '../../gql/generated/globalTypes';
import BoxedInputs from '../atoms/BoxedInputs';
import ControlledTextInput from '../atoms/ControlledInputs/ControlledTextInput';
import ControlledCodeInput from '../atoms/ControlledInputs/ControlledCodeInput';
import { FormProps } from '../../hooks/form/useFormValidation';
import ControlledBooleanSelect from '../atoms/ControlledInputs/ControlledBooleanSelect';
import { Alert } from '@mui/material';
import {
    getStorageProviderLabel,
    initialStorageProviderFields,
} from '../../utils/StorageProviderUtils';
import CheckBoxInput from '../atoms/InputTypes/CheckBoxInput';
import { useConfigState } from '../../context/AppContext';

const StorageProviderSelector = <T extends { [key: string]: any }>(
    props: FormProps<T> & {
        includeBigQueryPartitionFilter?: boolean;
        warnGraphDisabled?: boolean;
        isCreate: boolean;
        infoText?: string;
    },
): ReactElement => {
    const { mode } = useConfigState();

    const awsRegionValues = Object.keys(AWSRegion).map((key) => ({
        key,
        text: AWSRegion[key as unknown as keyof typeof AWSRegion].toLowerCase().replace(/_/g, '-'),
    }));

    const storageProviderValues = Object.keys(StorageProvider)
        .filter((key) => key !== StorageProvider.MONGODB || mode !== Mode.COMMERCIAL)
        .map((key) => ({
            key,
            text: getStorageProviderLabel(key),
        }));

    const dataSetLocationValues = [
        {
            key: 'US',
            text: 'US',
        },
        {
            key: 'EU',
            text: 'EU',
        },
    ];

    return (
        <>
            {props.isCreate ? (
                <>
                    <ControlledSelect
                        className="DrawerFormField"
                        label="Storage Provider"
                        name="storageProvider"
                        values={storageProviderValues}
                        formProps={props}
                        required
                        resetErrorsOnKeys={Object.keys(initialStorageProviderFields)}
                    />

                    {props.infoText && (
                        <Alert severity="info" className="DrawerFormField">
                            {props.infoText}
                        </Alert>
                    )}
                </>
            ) : (
                <CheckBoxInput
                    name="editStorageProviderSettings"
                    value={props.values.editStorageProviderSettings}
                    setValue={(v) => {
                        props.handleChange('editStorageProviderSettings', v);
                    }}
                    label="Edit Storage Provider Settings"
                    className="DrawerFormField"
                    sx={{ marginLeft: '-11px!important' }}
                    color="primary"
                />
            )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.AWS_KINESIS && (
                    <>
                        <BoxedInputs label="AWS Kinesis Storage Config">
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
                        </BoxedInputs>
                    </>
                )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.AWS_S3 && (
                    <>
                        {props.warnGraphDisabled && (
                            <Alert severity="warning" className="DrawerFormField">
                                If you use S3 as provider the graphs in the dashboard will be
                                disabled.
                            </Alert>
                        )}
                        <BoxedInputs label="AWS S3 Storage Config">
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
                    </>
                )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.GC_BIGQUERY_STREAM && (
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
                        <ControlledSelect
                            className="DrawerFormField"
                            label="Data Set Location"
                            name="dataSetLocation"
                            values={dataSetLocationValues}
                            formProps={props}
                            required
                        />
                        {props.includeBigQueryPartitionFilter && (
                            <ControlledBooleanSelect
                                className="DrawerFormField"
                                label="Require partition filter in queries"
                                name="requirePartitionFilterInQueries"
                                formProps={props}
                                required
                            />
                        )}
                    </BoxedInputs>
                )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.MONGODB && (
                    <BoxedInputs label="MongoDb Push Config">
                        <CheckBoxInput
                            name="useApiMongoServer"
                            value={props.values.useApiMongoServer}
                            setValue={(v) => {
                                props.handleChange('useApiMongoServer', v);
                            }}
                            label="Use API Mongo Server"
                            className="DrawerFormField"
                            sx={{ marginLeft: '-11px!important' }}
                            color="primary"
                        />
                        {!props.values.useApiMongoServer && (
                            <>
                                <ControlledTextInput
                                    name="connectionString"
                                    label="Connection String"
                                    formProps={props}
                                    className="DrawerFormField"
                                    required
                                />
                                <ControlledTextInput
                                    name="databaseName"
                                    label="Database Name"
                                    formProps={props}
                                    className="DrawerFormField"
                                    required
                                />
                            </>
                        )}
                    </BoxedInputs>
                )}
        </>
    );
};

export default StorageProviderSelector;
