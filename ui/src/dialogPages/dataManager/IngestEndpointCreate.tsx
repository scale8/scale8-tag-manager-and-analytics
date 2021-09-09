import { FC } from 'react';
import IngestEndpointForm from '../../components/organisms/Forms/IngestEndpointForm';
import { FormProps, FormValidationResult } from '../../hooks/form/useFormValidation';
import CreateIngestEndpointQuery from '../../gql/mutations/CreateIngestEndpointQuery';
import { ApolloError, useMutation } from '@apollo/client';
import { CreateIngestEndpointResult } from '../../gql/generated/CreateIngestEndpointResult';
import { DialogPageProps } from '../../types/DialogTypes';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import {
    IngestEndpointValidators,
    IngestEndpointValues,
} from '../../utils/forms/IngestEndpointFormUtils';
import { DialogForm, DialogFormProps } from '../abstractions/DialogForm';

export type IngestEndpointFormProps = FormProps<IngestEndpointValues>;

const IngestEndpointCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const dataManagerId = props.contextId;

    const ingestEndpointCreateProps: DialogFormProps<
        IngestEndpointValues,
        IngestEndpointFormProps,
        CreateIngestEndpointResult
    > = {
        buildInitialState: () => ({
            name: '',
        }),
        saveQuery: useMutation<CreateIngestEndpointResult>(CreateIngestEndpointQuery),
        mapSaveData: (formValues: IngestEndpointValues) => ({
            ingestEndpointCreateInput: {
                data_manager_account_id: dataManagerId,
                name: formValues.name,
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<IngestEndpointValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Ingest Endpoint',
            title: 'Create Ingest Endpoint',
            formInfoProps: buildStandardFormInfo('ingestEndpoints', 'Create'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createIngestEndpoint.id !== undefined,
        pageComponent: IngestEndpointForm,
        validators: IngestEndpointValidators,
        ...props,
    };

    return (
        <DialogForm<IngestEndpointValues, IngestEndpointFormProps, CreateIngestEndpointResult>
            {...ingestEndpointCreateProps}
        />
    );
};

export { IngestEndpointCreate };
