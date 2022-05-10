import { ReactElement } from 'react';
import ControlledSelect from '../atoms/ControlledInputs/ControlledSelect';
import { AWSRegion, Mode, StorageProvider } from '../../gql/generated/globalTypes';
import BoxedInputs from '../atoms/BoxedInputs';
import ControlledTextInput from '../atoms/ControlledInputs/ControlledTextInput';
import ControlledCodeInput from '../atoms/ControlledInputs/ControlledCodeInput';
import { FormProps } from '../../hooks/form/useFormValidation';
import ControlledBooleanSelect from '../atoms/ControlledInputs/ControlledBooleanSelect';
import {
    getStorageProviderLabel,
    initialStorageProviderFields,
} from '../../utils/StorageProviderUtils';
import CheckBoxInput from '../atoms/InputTypes/CheckBoxInput';
import { useConfigState } from '../../context/AppContext';
import { DialogFormSelect } from '../atoms/DialogFormInputs/DialogFormSelect';
import { DialogInfoAlert } from '../atoms/DialogFormInputs/DialogInfoAlert';
import { DialogWarningAlert } from '../atoms/DialogFormInputs/DialogWarningAlert';

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
                    <DialogFormSelect
                        label="Storage Provider"
                        name="storageProvider"
                        values={storageProviderValues}
                        resetErrorsOnKeys={Object.keys(initialStorageProviderFields)}
                    />

                    {props.infoText && <DialogInfoAlert>{props.infoText}</DialogInfoAlert>}
                </>
            ) : (
                <CheckBoxInput
                    name="editStorageProviderSettings"
                    value={props.values.editStorageProviderSettings}
                    setValue={(v) => {
                        props.handleChange('editStorageProviderSettings', v);
                    }}
                    label="Edit Storage Provider Settings"
                    className="DialogFormField"
                    sx={{ marginLeft: '-11px!important' }}
                    color="primary"
                />
            )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.AWS_KINESIS && (
                    <>
                        <BoxedInputs label="AWS Kinesis Storage Config">
                            <ControlledTextInput
                                name="streamName"
                                label="Stream Name"
                                formProps={props}
                                className="DialogFormField"
                                required
                            />
                            <ControlledTextInput
                                name="accessKeyId"
                                label="Access Key Id"
                                formProps={props}
                                className="DialogFormField"
                                required
                            />
                            <ControlledTextInput
                                name="secretAccessKey"
                                label="Secret Access Key"
                                formProps={props}
                                className="DialogFormField"
                                required
                            />
                            <ControlledSelect
                                className="DialogFormField"
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
                            <DialogWarningAlert>
                                If you use S3 as provider the graphs in the dashboard will be
                                disabled.
                            </DialogWarningAlert>
                        )}
                        <BoxedInputs label="AWS S3 Storage Config">
                            <ControlledTextInput
                                name="bucketName"
                                label="Bucket Name"
                                formProps={props}
                                className="DialogFormField"
                                required
                            />
                            <ControlledTextInput
                                name="accessKeyId"
                                label="Access Key Id"
                                formProps={props}
                                className="DialogFormField"
                                required
                            />
                            <ControlledTextInput
                                name="secretAccessKey"
                                label="Secret Access Key"
                                formProps={props}
                                className="DialogFormField"
                                required
                            />
                            <ControlledSelect
                                className="DialogFormField"
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
                                className="DialogFormField"
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
                            className="DialogFormField"
                            required
                        />
                        <ControlledSelect
                            className="DialogFormField"
                            label="Data Set Location"
                            name="dataSetLocation"
                            values={dataSetLocationValues}
                            formProps={props}
                            required
                        />
                        {props.includeBigQueryPartitionFilter && (
                            <ControlledBooleanSelect
                                className="DialogFormField"
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
                            className="DialogFormField"
                            sx={{ marginLeft: '-11px!important' }}
                            color="primary"
                        />
                        {!props.values.useApiMongoServer && (
                            <>
                                <ControlledTextInput
                                    name="connectionString"
                                    label="Connection String"
                                    formProps={props}
                                    className="DialogFormField"
                                    required
                                />
                                <ControlledTextInput
                                    name="databaseName"
                                    label="Database Name"
                                    formProps={props}
                                    className="DialogFormField"
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
