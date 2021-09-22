import { Dispatch, FC, SetStateAction } from 'react';
import IngestEndpointEnvironmentForm from '../../components/organisms/Forms/IngestEndpointEnvironmentForm';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import CreateIngestEndpointEnvironmentQuery from '../../gql/mutations/CreateIngestEndpointEnvironmentQuery';
import FetchIngestEndpointRevisionsQuery from '../../gql/queries/FetchIngestEndpointRevisionsQuery';
import { IngestEndpointRevisionsData } from '../../gql/generated/IngestEndpointRevisionsData';
import {
    IngestEndpointEnvironmentCreateInput,
    Mode,
    StorageProvider,
} from '../../gql/generated/globalTypes';
import nameValidator from '../../utils/validators/nameValidator';
import { CreateIngestEndpointEnvironmentResult } from '../../gql/generated/CreateIngestEndpointEnvironmentResult';
import domainValidator from '../../utils/validators/domainValidator';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { useConfigState } from '../../context/AppContext';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';
import {
    buildStorageProviderSaveProperties,
    initialStorageProviderFieldsWithPartitionFilterChoice,
    storageProviderCustomValueSetter,
    StorageProviderFieldsWithPartitionFilterChoice,
    storageProviderValidators,
} from '../../utils/StorageProviderUtils';

export type IngestEndpointEnvironmentValues = StorageProviderFieldsWithPartitionFilterChoice & {
    name: string;
    revisionId: string;
    domain?: string;
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
    if (storageProviderCustomValueSetter(valueKey, value, values, setValues)) {
        return;
    }
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
            ...initialStorageProviderFieldsWithPartitionFilterChoice,
            name: '',
            revisionId: '',
            domain: '',
            certificate: '',
            key: '',
        }),
        saveQuery: useMutation(CreateIngestEndpointEnvironmentQuery),
        mapSaveData: (ingestEndpointEnvironmentValues: IngestEndpointEnvironmentValues) => {
            const ingestEndpointEnvironmentCreateInput: IngestEndpointEnvironmentCreateInput = {
                ingest_endpoint_id: ingestEndpointId,
                ingest_endpoint_revision_id: ingestEndpointEnvironmentValues.revisionId,
                storage_provider:
                    ingestEndpointEnvironmentValues.storageProvider as StorageProvider,
                name: ingestEndpointEnvironmentValues.name,
                ...buildStorageProviderSaveProperties(ingestEndpointEnvironmentValues, true, true),
            };

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
            ...storageProviderValidators,
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
