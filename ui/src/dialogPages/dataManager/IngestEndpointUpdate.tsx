import { FC } from 'react';
import IngestEndpointForm from '../../components/organisms/Forms/IngestEndpointForm';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { UpdateIngestEndpointGetData } from '../../gql/generated/UpdateIngestEndpointGetData';
import UpdateIngestEndpointGetQuery from '../../gql/queries/UpdateIngestEndpointGetQuery';
import UpdateIngestEndpointQuery from '../../gql/mutations/UpdateIngestEndpointQuery';
import { IngestEndpointFormProps } from './IngestEndpointCreate';
import { FormValidationResult } from '../../hooks/form/useFormValidation';
import { UpdateIngestEndpointResult } from '../../gql/generated/UpdateIngestEndpointResult';
import { DialogPageProps } from '../../types/DialogTypes';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import {
    IngestEndpointValidators,
    IngestEndpointValues,
} from '../../utils/forms/IngestEndpointFormUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

const IngestEndpointUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ingestEndpointUpdateProps: DialogPreloadFormProps<
        UpdateIngestEndpointGetData,
        IngestEndpointValues,
        IngestEndpointFormProps,
        UpdateIngestEndpointResult
    > = {
        loadQuery: useQuery<UpdateIngestEndpointGetData>(UpdateIngestEndpointGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateIngestEndpointGetData) => ({
            name: formLoadedData.getIngestEndpoint.name,
        }),
        saveQuery: useMutation(UpdateIngestEndpointQuery),
        mapSaveData: (formValues: IngestEndpointValues) => ({
            ingestEndpointUpdateInput: {
                ingest_endpoint_id: props.id,
                name: formValues.name,
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateIngestEndpointGetData,
            formValidationValues: FormValidationResult<IngestEndpointValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Ingest Endpoint',
            title: 'Update Ingest Endpoint',
            formInfoProps: buildStandardFormInfo('ingestEndpoints', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateIngestEndpoint,
        pageComponent: IngestEndpointForm,
        validators: IngestEndpointValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateIngestEndpointGetData,
            IngestEndpointValues,
            IngestEndpointFormProps,
            UpdateIngestEndpointResult
        >
            {...ingestEndpointUpdateProps}
        />
    );
};

export { IngestEndpointUpdate };
