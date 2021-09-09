import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import IngestEndpointRevisionForm from '../../components/organisms/Forms/IngestEndpointRevisionForm';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { UpdateIngestEndpointRevisionGetData } from '../../gql/generated/UpdateIngestEndpointRevisionGetData';
import UpdateIngestEndpointRevisionGetQuery from '../../gql/queries/UpdateIngestEndpointRevisionGetQuery';
import UpdateIngestEndpointRevisionQuery from '../../gql/mutations/UpdateIngestEndpointRevisionQuery';
import nameValidator from '../../utils/validators/nameValidator';
import { UpdateIngestEndpointRevisionResult } from '../../gql/generated/UpdateIngestEndpointRevisionResult';
import { DialogPageProps } from '../../types/DialogTypes';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

export type IngestEndpointRevisionValues = {
    name: string;
};

export type IngestEndpointRevisionFormProps = FormProps<IngestEndpointRevisionValues>;

const IngestEndpointRevisionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ingestEndpointRevisionUpdateProps: DialogPreloadFormProps<
        UpdateIngestEndpointRevisionGetData,
        IngestEndpointRevisionValues,
        IngestEndpointRevisionFormProps,
        UpdateIngestEndpointRevisionResult
    > = {
        loadQuery: useQuery<UpdateIngestEndpointRevisionGetData>(
            UpdateIngestEndpointRevisionGetQuery,
            {
                variables: { id: props.id },
            },
        ),
        buildInitialStatePreload: (formLoadedData: UpdateIngestEndpointRevisionGetData) => ({
            name: formLoadedData.getIngestEndpointRevision.name,
        }),
        saveQuery: useMutation(UpdateIngestEndpointRevisionQuery),
        mapSaveData: (formValues: IngestEndpointRevisionValues) => ({
            ingestEndpointRevisionUpdateInput: {
                ingest_endpoint_revision_id: props.id,
                name: formValues.name,
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateIngestEndpointRevisionGetData,
            formValidationValues: FormValidationResult<IngestEndpointRevisionValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Revision',
            title: 'Update Revision',
            formInfoProps: buildStandardFormInfo('ingestEndpointRevisions', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.updateIngestEndpointRevision,
        pageComponent: IngestEndpointRevisionForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Name too short',
            },
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateIngestEndpointRevisionGetData,
            IngestEndpointRevisionValues,
            IngestEndpointRevisionFormProps,
            UpdateIngestEndpointRevisionResult
        >
            {...ingestEndpointRevisionUpdateProps}
        />
    );
};

export { IngestEndpointRevisionUpdate };
