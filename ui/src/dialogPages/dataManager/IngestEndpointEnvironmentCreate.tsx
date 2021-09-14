import { Dispatch, FC, SetStateAction } from 'react';
import IngestEndpointEnvironmentForm from '../../components/organisms/Forms/IngestEndpointEnvironmentForm';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import CreateIngestEndpointEnvironmentQuery from '../../gql/mutations/CreateIngestEndpointEnvironmentQuery';
import FetchIngestEndpointRevisionsQuery from '../../gql/queries/FetchIngestEndpointRevisionsQuery';
import { IngestEndpointRevisionsData } from '../../gql/generated/IngestEndpointRevisionsData';
import {
    AWSRegion,
    AWSStorageConfig,
    GCBigQueryStreamConfig,
    IngestEndpointEnvironmentCreateInput,
    Mode,
    MongoDbPushConfig,
    StorageProvider,
} from '../../gql/generated/globalTypes';
import nameValidator from '../../utils/validators/nameValidator';
import { CreateIngestEndpointEnvironmentResult } from '../../gql/generated/CreateIngestEndpointEnvironmentResult';
import domainValidator from '../../utils/validators/domainValidator';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { useConfigState } from '../../context/AppContext';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

export type IngestEndpointEnvironmentValues = {
    name: string;
    revisionId: string;
    storageProvider?: string;
    bucketName?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    pathPrefix?: string;
    serviceAccountJSON?: string;
    dataSetName?: string;
    requirePartitionFilterInQueries?: boolean;
    domain?: string;
    connectionString?: string;
    databaseName?: string;
    certificate: string;
    key: string;
};

export type IngestEndpointEnvironmentFormProps = FormProps<IngestEndpointEnvironmentValues> & {
    isCreate: boolean;
    availableRevisions: { key: string; text: string }[];
    hasCustomDomain?: boolean;
};

const customValueSetter = (
    valueKey: string,
    value: any,
    values: IngestEndpointEnvironmentValues,
    setValues: Dispatch<SetStateAction<IngestEndpointEnvironmentValues>>,
) => {
    if (valueKey === 'domain') {
        setValues({
            ...values,
            [valueKey]: value,
            certificate: value === '' ? '' : values.certificate,
            key: value === '' ? '' : values.key,
        });
    } else {
        setValues({
            ...values,
            [valueKey]: value,
        });
    }
};

const IngestEndpointEnvironmentCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ingestEndpointId = props.contextId;
    const { mode } = useConfigState();

    const ingestEndpointEnvironmentCreateProps: DialogPreloadFormProps<
        IngestEndpointRevisionsData,
        IngestEndpointEnvironmentValues,
        IngestEndpointEnvironmentFormProps,
        CreateIngestEndpointEnvironmentResult
    > = {
        loadQuery: useQuery<IngestEndpointRevisionsData>(FetchIngestEndpointRevisionsQuery, {
            variables: { id: ingestEndpointId },
        }),
        buildInitialStatePreload: () => ({
            name: '',
            revisionId: '',
            bucketName: '',
            storageProvider: '',
            accessKeyId: '',
            secretAccessKey: '',
            region: '',
            pathPrefix: '',
            serviceAccountJSON: '',
            dataSetName: '',
            requirePartitionFilterInQueries: false,
            domain: '',
            connectionString: '',
            databaseName: '',
            certificate: '',
            key: '',
        }),
        saveQuery: useMutation(CreateIngestEndpointEnvironmentQuery),
        mapSaveData: (ingestEndpointEnvironmentValues: IngestEndpointEnvironmentValues) => {
            const pathPrefix = ingestEndpointEnvironmentValues.pathPrefix ?? '';

            const aws_storage_config: AWSStorageConfig = {
                access_key_id: ingestEndpointEnvironmentValues.accessKeyId ?? '',
                secret_access_key: ingestEndpointEnvironmentValues.secretAccessKey ?? '',
                region: ingestEndpointEnvironmentValues.region as AWSRegion,
                bucket_name: ingestEndpointEnvironmentValues.bucketName ?? '',
                path_prefix: pathPrefix === '' ? pathPrefix : undefined,
            };

            const parseServiceAccountJson = (): S8JSON => {
                try {
                    return JSON.parse(ingestEndpointEnvironmentValues.serviceAccountJSON ?? '{}');
                } catch {
                    return JSON.parse('{}');
                }
            };

            const gc_bigquery_stream_config: GCBigQueryStreamConfig = {
                service_account_json: parseServiceAccountJson(),
                data_set_name: ingestEndpointEnvironmentValues.dataSetName ?? '',
                require_partition_filter_in_queries:
                    !!ingestEndpointEnvironmentValues.requirePartitionFilterInQueries,
            };

            const mongo_push_config: MongoDbPushConfig = {
                connection_string: ingestEndpointEnvironmentValues.connectionString ?? '',
                database_name: ingestEndpointEnvironmentValues.databaseName ?? '',
            };

            const ingestEndpointEnvironmentCreateInput: IngestEndpointEnvironmentCreateInput = {
                ingest_endpoint_id: ingestEndpointId,
                ingest_endpoint_revision_id: ingestEndpointEnvironmentValues.revisionId,
                storage_provider:
                    ingestEndpointEnvironmentValues.storageProvider as StorageProvider,
                name: ingestEndpointEnvironmentValues.name,
            };

            if (ingestEndpointEnvironmentValues.storageProvider === StorageProvider.AWS_S3) {
                ingestEndpointEnvironmentCreateInput.aws_storage_config = aws_storage_config;
            }

            if (
                ingestEndpointEnvironmentValues.storageProvider ===
                StorageProvider.GC_BIGQUERY_STREAM
            ) {
                ingestEndpointEnvironmentCreateInput.gc_bigquery_stream_config =
                    gc_bigquery_stream_config;
            }

            if (ingestEndpointEnvironmentValues.storageProvider === StorageProvider.MONGODB) {
                ingestEndpointEnvironmentCreateInput.mongo_push_config = mongo_push_config;
            }

            if (ingestEndpointEnvironmentValues.domain !== '') {
                ingestEndpointEnvironmentCreateInput.custom_domain =
                    ingestEndpointEnvironmentValues.domain;
                ingestEndpointEnvironmentCreateInput.cert_pem =
                    ingestEndpointEnvironmentValues.certificate;
                ingestEndpointEnvironmentCreateInput.key_pem = ingestEndpointEnvironmentValues.key;
            }

            return { ingestEndpointEnvironmentCreateInput };
        },
        buildFormProps: (
            formLoadedData: IngestEndpointRevisionsData,
            formValidationValues: FormValidationResult<IngestEndpointEnvironmentValues>,
            gqlError?: ApolloError,
        ) => {
            const filteredRevisions =
                formLoadedData.getIngestEndpoint.ingest_endpoint_revisions.filter((_) => _.locked);

            return {
                ...formValidationValues,
                gqlError,
                submitText: 'Create Environment',
                title: 'Create Environment',
                availableRevisions: filteredRevisions.map((_) => ({
                    key: _.id,
                    text: _.name,
                })),
                isCreate: true,
                formInfoProps: buildStandardFormInfo('ingestEndpointEnvironments', 'Create'),
                handleDialogClose: props.handleDialogClose,
                hasCustomDomain: mode === Mode.COMMERCIAL ? undefined : false,
            };
        },
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createIngestEndpointEnvironment.id !== undefined,
        pageComponent: IngestEndpointEnvironmentForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Ingest Endpoint Environment name too short',
            },
            {
                field: 'domain',
                validator: domainValidator,
                error: () => 'Invalid domain',
                ignoreEmpty: true,
            },
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
        ],
        customValueSetter,
        ...props,
    };

    return (
        <DialogPreloadForm<
            IngestEndpointRevisionsData,
            IngestEndpointEnvironmentValues,
            IngestEndpointEnvironmentFormProps,
            CreateIngestEndpointEnvironmentResult
        >
            {...ingestEndpointEnvironmentCreateProps}
        />
    );
};

export { IngestEndpointEnvironmentCreate };
