import {
    AWSRegion,
    AWSStorageConfig,
    GCBigQueryStreamConfig,
    MongoDbPushConfig,
    StorageProvider,
} from '../gql/generated/globalTypes';
import { Dispatch, SetStateAction } from 'react';
import { ValidateConfiguration } from './validators/validateFormValues';

export const getStorageProviderLabel = (key: string): string => {
    switch (key) {
        case StorageProvider.GC_BIGQUERY_STREAM:
            return 'Google Cloud BigQuery Stream';
        case StorageProvider.AWS_KINESIS:
            return 'Amazon Kinesis';
        case StorageProvider.AWS_S3:
            return 'Amazon AWS S3';
        case StorageProvider.MONGODB:
            return 'MongoDB Database';
        default:
            return key;
    }
};

export type StorageProviderFields = {
    storageProvider?: string;
    bucketName?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    pathPrefix?: string;
    serviceAccountJSON?: string;
    dataSetName?: string;
    dataSetLocation?: string;
    connectionString?: string;
    databaseName?: string;
    useApiMongoServer?: boolean;
    editStorageProviderSettings?: boolean;
};

export type StorageProviderFieldsWithPartitionFilterChoice = StorageProviderFields & {
    requirePartitionFilterInQueries?: boolean;
};

export const initialStorageProviderFields = {
    editStorageProviderSettings: false,
    storageProvider: '',
    bucketName: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    pathPrefix: '',
    serviceAccountJSON: '',
    dataSetName: '',
    dataSetLocation: 'US',
    connectionString: '',
    databaseName: '',
    useApiMongoServer: true,
};

export const initialStorageProviderFieldsWithPartitionFilterChoice = {
    ...initialStorageProviderFields,
    requirePartitionFilterInQueries: false,
};

export const storageProviderCustomValueSetter = (
    valueKey: string,
    value: any,
    values: any,
    setValues: Dispatch<SetStateAction<any>>,
): boolean => {
    if (valueKey === 'storageProvider') {
        setValues({
            ...values,
            ...initialStorageProviderFields,
            [valueKey]: value,
        });
        return true;
    } else {
        return false;
    }
};

export const storageProviderValidators: ValidateConfiguration<any>[] = [
    {
        field: 'serviceAccountJSON',
        validator: async (value, values): Promise<-1 | 0 | string> => {
            if (values.storageProvider === StorageProvider.GC_BIGQUERY_STREAM) {
                const gcJSON = value === undefined ? '' : (value as string);
                if (gcJSON.length === 0) {
                    return 'Service Account Config is required';
                } else {
                    try {
                        JSON.parse(gcJSON);
                    } catch {
                        return 'Service Account Config is not in a valid JSON format';
                    }
                    return -1;
                }
            } else {
                return -1;
            }
        },
        error: (result) => (result === 0 ? 'Invalid' : result),
    },
];

export const buildStorageBackendSaveProperties = (
    values: StorageProviderFieldsWithPartitionFilterChoice,
    isCreate = false,
    hasPartitionFilterChoice = false,
): {
    aws_storage_config?: AWSStorageConfig;
    gc_bigquery_stream_config?: GCBigQueryStreamConfig;
    mongo_push_config?: MongoDbPushConfig;
} => {
    const pathPrefix = values.pathPrefix ?? '';

    const aws_storage_config: AWSStorageConfig = {
        access_key_id: values.accessKeyId ?? '',
        secret_access_key: values.secretAccessKey ?? '',
        region: values.region as AWSRegion,
        bucket_name: values.bucketName ?? '',
        path_prefix: pathPrefix === '' ? pathPrefix : undefined,
    };

    const parseServiceAccountJson = (): S8JSON => {
        try {
            return JSON.parse(values.serviceAccountJSON ?? '{}');
        } catch {
            return JSON.parse('{}');
        }
    };

    const gc_bigquery_stream_config: GCBigQueryStreamConfig = {
        service_account_json: parseServiceAccountJson(),
        data_set_name: values.dataSetName ?? '',
        data_set_location: values.dataSetLocation ?? '',
        require_partition_filter_in_queries: hasPartitionFilterChoice
            ? !!values.requirePartitionFilterInQueries
            : true,
    };

    const mongo_push_config: MongoDbPushConfig = values.useApiMongoServer
        ? { use_api_mongo_server: true }
        : {
              use_api_mongo_server: false,
              connection_string: values.connectionString ?? '',
              database_name: values.databaseName ?? '',
          };

    if (isCreate || values.editStorageProviderSettings) {
        if (values.storageProvider === StorageProvider.AWS_S3) {
            return { aws_storage_config };
        }

        if (values.storageProvider === StorageProvider.GC_BIGQUERY_STREAM) {
            return { gc_bigquery_stream_config };
        }

        return { mongo_push_config };
    } else {
        return {};
    }
};
