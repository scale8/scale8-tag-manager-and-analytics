import { FC } from 'react';
import IngestEndpointEnvironmentForm from '../../components/organisms/Forms/IngestEndpointEnvironmentForm';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateIngestEndpointEnvironmentQuery from '../../gql/mutations/UpdateIngestEndpointEnvironmentQuery';
import { IngestEndpointEnvironmentUpdateInput } from '../../gql/generated/globalTypes';
import { UpdateIngestEndpointEnvironmentGetData } from '../../gql/generated/UpdateIngestEndpointEnvironmentGetData';
import UpdateIngestEndpointEnvironmentGetQuery from '../../gql/queries/UpdateIngestEndpointEnvironmentGetQuery';
import {
    IngestEndpointEnvironmentFormProps,
    IngestEndpointEnvironmentValues,
} from './IngestEndpointEnvironmentCreate';
import { FormValidationResult } from '../../hooks/form/useFormValidation';
import nameValidator from '../../utils/validators/nameValidator';
import { UpdateIngestEndpointEnvironmentResult } from '../../gql/generated/UpdateIngestEndpointEnvironmentResult';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';
import {
    buildStorageBackendSaveProperties,
    initialStorageProviderFieldsWithPartitionFilterChoice,
    storageProviderValidators,
} from '../../utils/StorageProviderUtils';

const IngestEndpointEnvironmentUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ingestEndpointId = props.contextId;

    const ingestEndpointEnvironmentUpdateProps: DialogPreloadFormProps<
        UpdateIngestEndpointEnvironmentGetData,
        IngestEndpointEnvironmentValues,
        IngestEndpointEnvironmentFormProps,
        UpdateIngestEndpointEnvironmentResult
    > = {
        loadQuery: useQuery<UpdateIngestEndpointEnvironmentGetData>(
            UpdateIngestEndpointEnvironmentGetQuery,
            {
                variables: { id: props.id, ingestEndpointId: ingestEndpointId },
            },
        ),
        buildInitialStatePreload: (
            formLoadedData: UpdateIngestEndpointEnvironmentGetData,
        ): IngestEndpointEnvironmentValues => ({
            name: formLoadedData.getIngestEndpointEnvironment.name,
            revisionId:
                formLoadedData.getIngestEndpointEnvironment.ingest_endpoint_revision?.id ?? '',
            ...initialStorageProviderFieldsWithPartitionFilterChoice,
            storageProvider: formLoadedData.getIngestEndpointEnvironment.storage_provider ?? '',
            certificate: '',
            key: '',
        }),
        saveQuery: useMutation(UpdateIngestEndpointEnvironmentQuery),
        mapSaveData: (ingestEndpointEnvironmentValues: IngestEndpointEnvironmentValues) => {
            const ingestEndpointEnvironmentUpdateInput: IngestEndpointEnvironmentUpdateInput = {
                ingest_endpoint_environment_id: props.id,
                ingest_endpoint_revision_id: ingestEndpointEnvironmentValues.revisionId,
                name: ingestEndpointEnvironmentValues.name,
                storage_backend: buildStorageBackendSaveProperties(
                    ingestEndpointEnvironmentValues,
                    false,
                ),
            };

            if (ingestEndpointEnvironmentValues.certificate !== '') {
                ingestEndpointEnvironmentUpdateInput.cert_pem =
                    ingestEndpointEnvironmentValues.certificate;
            }

            if (ingestEndpointEnvironmentValues.key !== '') {
                ingestEndpointEnvironmentUpdateInput.key_pem = ingestEndpointEnvironmentValues.key;
            }

            return { ingestEndpointEnvironmentUpdateInput };
        },
        buildFormProps: (
            formLoadedData: UpdateIngestEndpointEnvironmentGetData,
            formValidationValues: FormValidationResult<IngestEndpointEnvironmentValues>,
            gqlError?: ApolloError,
        ) => {
            const filteredRevisions =
                formLoadedData.getIngestEndpoint.ingest_endpoint_revisions.filter((_) => _.locked);

            return {
                ...formValidationValues,
                gqlError,
                submitText: 'Update Environment',
                title: 'Update Environment',
                availableRevisions: filteredRevisions.map((_) => ({
                    key: _.id,
                    text: _.name,
                })),
                isCreate: false,
                formInfoProps: buildStandardFormInfo('ingestEndpointEnvironments', 'Update'),
                handleDialogClose: props.handleDialogClose,
            };
        },
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.updateIngestEndpointEnvironment,
        pageComponent: IngestEndpointEnvironmentForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Ingest Endpoint Environment name too short',
            },
            ...storageProviderValidators,
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateIngestEndpointEnvironmentGetData,
            IngestEndpointEnvironmentValues,
            IngestEndpointEnvironmentFormProps,
            UpdateIngestEndpointEnvironmentResult
        >
            {...ingestEndpointEnvironmentUpdateProps}
        />
    );
};

export default IngestEndpointEnvironmentUpdate;
