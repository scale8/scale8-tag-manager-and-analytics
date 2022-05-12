import { ReactElement } from 'react';
import { AWSRegion, Mode, StorageProvider } from '../../gql/generated/globalTypes';
import BoxedInputs from '../atoms/BoxedInputs';
import { FormProps } from '../../hooks/form/useFormValidation';
import {
    getStorageProviderLabel,
    initialStorageProviderFields,
} from '../../utils/StorageProviderUtils';
import { useConfigState } from '../../context/AppContext';
import { DialogFormSelect } from '../atoms/DialogFormInputs/DialogFormSelect';
import { DialogInfoAlert } from '../atoms/DialogFormInputs/DialogInfoAlert';
import { DialogWarningAlert } from '../atoms/DialogFormInputs/DialogWarningAlert';
import { DialogFormCheckbox } from '../atoms/DialogFormInputs/DialogFormCheckbox';
import { DialogFormTextInput } from '../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormContextProvider } from '../../context/DialogFormContext';
import { DialogFormBooleanSelect } from '../atoms/DialogFormInputs/DialogFormBooleanSelect';
import { DialogFormCodeInput } from '../atoms/DialogFormInputs/DialogFormCodeInput';

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
        <DialogFormContextProvider<T> formProps={props}>
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
                <DialogFormCheckbox
                    name="editStorageProviderSettings"
                    label="Edit Storage Provider Settings"
                    realignLeft
                />
            )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.AWS_KINESIS && (
                    <>
                        {props.warnGraphDisabled && (
                            <DialogWarningAlert>
                                If you use Kinesis as provider the graphs in the dashboard will be
                                disabled.
                            </DialogWarningAlert>
                        )}
                        <BoxedInputs label="AWS Kinesis Storage Config">
                            <DialogFormTextInput name="streamName" label="Stream Name" />
                            <DialogFormTextInput name="accessKeyId" label="Access Key Id" />
                            <DialogFormTextInput name="secretAccessKey" label="Secret Access Key" />
                            <DialogFormSelect
                                label="Region"
                                name="region"
                                values={awsRegionValues}
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
                            <DialogFormTextInput name="bucketName" label="Bucket Name" />
                            <DialogFormTextInput name="accessKeyId" label="Access Key Id" />
                            <DialogFormTextInput name="secretAccessKey" label="Secret Access Key" />
                            <DialogFormSelect
                                label="Region"
                                name="region"
                                values={awsRegionValues}
                            />
                            <DialogFormTextInput name="pathPrefix" label="Path Prefix" optional />
                        </BoxedInputs>
                    </>
                )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.GC_BIGQUERY_STREAM && (
                    <BoxedInputs label="Google Cloud BigQuery Stream Config">
                        <DialogFormCodeInput
                            name="serviceAccountJSON"
                            label="Service Account Config"
                            mode="json"
                        />
                        <DialogFormTextInput name="dataSetName" label="Data Set Name" />
                        <DialogFormSelect
                            label="Data Set Location"
                            name="dataSetLocation"
                            values={dataSetLocationValues}
                        />
                        {props.includeBigQueryPartitionFilter && (
                            <DialogFormBooleanSelect
                                label="Require partition filter in queries"
                                name="requirePartitionFilterInQueries"
                            />
                        )}
                    </BoxedInputs>
                )}
            {(props.isCreate || props.values.editStorageProviderSettings) &&
                props.values.storageProvider === StorageProvider.MONGODB && (
                    <BoxedInputs label="MongoDb Push Config">
                        <DialogFormCheckbox
                            name="useApiMongoServer"
                            label="Use API Mongo Server"
                            realignLeft
                        />
                        {!props.values.useApiMongoServer && (
                            <>
                                <DialogFormTextInput
                                    name="connectionString"
                                    label="Connection String"
                                />
                                <DialogFormTextInput name="databaseName" label="Database Name" />
                            </>
                        )}
                    </BoxedInputs>
                )}
        </DialogFormContextProvider>
    );
};

export default StorageProviderSelector;
