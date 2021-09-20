import { Dispatch, FC, SetStateAction } from 'react';
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
import {
    buildStorageProviderSaveProperties,
    initialStorageProviderFields,
} from '../../utils/StorageProviderUtils';

const IngestEndpointUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const customValueSetter = (
        valueKey: string,
        value: any,
        values: IngestEndpointValues,
        setValues: Dispatch<SetStateAction<IngestEndpointValues>>,
    ) => {
        if (valueKey === 'analyticsEnabled') {
            if (!values.analyticsEnabled) {
                setValues({
                    ...values,
                    editStorageProviderSettings: false,
                    [valueKey]: value,
                });
            } else {
                setValues({
                    ...values,
                    [valueKey]: value,
                });
            }
        } else {
            setValues({
                ...values,
                [valueKey]: value,
            });
        }
    };

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
            ...initialStorageProviderFields,
            storageProvider: formLoadedData.getIngestEndpoint.storage_provider,
            name: formLoadedData.getIngestEndpoint.name,
            analyticsEnabled: formLoadedData.getIngestEndpoint.analytics_enabled,
        }),
        saveQuery: useMutation(UpdateIngestEndpointQuery),
        mapSaveData: (formValues: IngestEndpointValues) => ({
            ingestEndpointUpdateInput: {
                ingest_endpoint_id: props.id,
                name: formValues.name,
                analytics_enabled: formValues.analyticsEnabled,
                ...buildStorageProviderSaveProperties(formValues, false),
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
            isCreate: false,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateIngestEndpoint,
        pageComponent: IngestEndpointForm,
        validators: IngestEndpointValidators,
        customValueSetter,
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
