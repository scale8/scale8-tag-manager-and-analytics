import { FC } from 'react';
import { FormValidationResult } from '../../hooks/form/useFormValidation';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../components/organisms/Forms/DuplicateDialogForm';
import { useMutation, useQuery } from '@apollo/client';
import DuplicateIngestEndpointRevisionGetQuery from '../../gql/queries/DuplicateIngestEndpointRevisionGetQuery';
import { DuplicateIngestEndpointRevisionGetData } from '../../gql/generated/DuplicateIngestEndpointRevisionGetData';
import { DuplicateIngestEndpointRevision } from '../../gql/generated/DuplicateIngestEndpointRevision';
import DuplicateIngestEndpointRevisionQuery from '../../gql/mutations/DuplicateIngestEndpointRevisionQuery';
import { ApolloError } from '@apollo/client/errors';
import { DialogPageProps } from '../../types/DialogTypes';
import { DuplicateValidators, DuplicateValues } from '../../utils/forms/DuplicateDialogFormUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

const IngestEndpointRevisionDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ingestEndpointRevisionDuplicateProps: DialogPreloadFormProps<
        DuplicateIngestEndpointRevisionGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateIngestEndpointRevision
    > = {
        loadQuery: useQuery<DuplicateIngestEndpointRevisionGetData>(
            DuplicateIngestEndpointRevisionGetQuery,
            {
                variables: { id: props.id },
            },
        ),
        buildInitialStatePreload: (formLoadedData: DuplicateIngestEndpointRevisionGetData) => ({
            name: `${formLoadedData.getIngestEndpointRevision.name} Copy`,
        }),
        saveQuery: useMutation<DuplicateIngestEndpointRevision>(
            DuplicateIngestEndpointRevisionQuery,
        ),
        mapSaveData: (formValues: DuplicateValues) => ({
            duplicateIngestEndpointRevisionInput: {
                new_name: formValues.name,
                ingest_endpoint_revision_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateIngestEndpointRevisionGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Revision',
            title: 'Create Revision',
            oldName: formLoadedData.getIngestEndpointRevision.name,
            description: `Create a new IngestEndpoint Revision from ${formLoadedData.getIngestEndpointRevision.name}?`,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicateIngestEndpointRevision.id !== undefined,
        getSavedId: (formMutationData) => formMutationData?.duplicateIngestEndpointRevision.id,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicateIngestEndpointRevisionGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicateIngestEndpointRevision
        >
            {...ingestEndpointRevisionDuplicateProps}
        />
    );
};

export { IngestEndpointRevisionDuplicate };
