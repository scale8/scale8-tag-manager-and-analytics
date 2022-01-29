import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateIngestEndpointEnvironmentQuery from '../../gql/mutations/UpdateIngestEndpointEnvironmentQuery';
import { IngestEndpointEnvironmentUpdateInput } from '../../gql/generated/globalTypes';
import { FormValidationResult } from '../../hooks/form/useFormValidation';
import { UpdateIngestEndpointEnvironmentResult } from '../../gql/generated/UpdateIngestEndpointEnvironmentResult';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';
import CustomDomainForm from '../../components/organisms/Forms/CustomDomainForm';
import {
    CustomDomainFormProps,
    CustomDomainValidators,
    CustomDomainValues,
} from '../../utils/forms/CustomDomainFormUtils';
import { UpdateIngestEndpointCustomDomainGetQueryData } from '../../gql/generated/UpdateIngestEndpointCustomDomainGetQueryData';
import UpdateIngestEndpointCustomDomainGetQuery from '../../gql/queries/UpdateIngestEndpointCustomDomainGetQuery';

const IngestEndpointEnvironmentEditCustomDomain: FC<DialogPageProps> = (props: DialogPageProps) => {
    const ingestEndpointId = props.contextId;

    const ingestEndpointEnvironmentUpdateProps: DialogPreloadFormProps<
        UpdateIngestEndpointCustomDomainGetQueryData,
        CustomDomainValues,
        CustomDomainFormProps,
        UpdateIngestEndpointEnvironmentResult
    > = {
        loadQuery: useQuery<UpdateIngestEndpointCustomDomainGetQueryData>(
            UpdateIngestEndpointCustomDomainGetQuery,
            {
                variables: { id: props.id, ingestEndpointId: ingestEndpointId },
            },
        ),
        buildInitialStatePreload: (
            formLoadedData: UpdateIngestEndpointCustomDomainGetQueryData,
        ): CustomDomainValues => ({
            domain: formLoadedData.getIngestEndpointEnvironment.custom_domain ?? '',
            certificate: '',
            key: '',
        }),
        saveQuery: useMutation(UpdateIngestEndpointEnvironmentQuery),
        mapSaveData: (environmentValues: CustomDomainValues) => {
            const ingestEndpointEnvironmentUpdateInput: IngestEndpointEnvironmentUpdateInput = {
                ingest_endpoint_environment_id: props.id,
                custom_domain: environmentValues.domain,
                cert_pem: environmentValues.certificate,
                key_pem: environmentValues.key,
            };

            return { ingestEndpointEnvironmentUpdateInput };
        },
        buildFormProps: (
            formLoadedData: UpdateIngestEndpointCustomDomainGetQueryData,
            formValidationValues: FormValidationResult<CustomDomainValues>,
            gqlError?: ApolloError,
        ) => {
            return {
                ...formValidationValues,
                gqlError,
                submitText: formLoadedData.getIngestEndpointEnvironment.custom_domain
                    ? 'Edit Custom Domain'
                    : 'Create Custom Domain',
                title: formLoadedData.getIngestEndpointEnvironment.custom_domain
                    ? 'Edit Custom Domain'
                    : 'Create Custom Domain',
                formInfoProps: buildStandardFormInfo(
                    'ingestEndpointEnvironments',
                    'EditCustomDomain',
                ),
                handleDialogClose: props.handleDialogClose,
                cname: formLoadedData.getIngestEndpointEnvironment.cname,
            };
        },
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.updateIngestEndpointEnvironment,
        pageComponent: CustomDomainForm,
        validators: CustomDomainValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateIngestEndpointCustomDomainGetQueryData,
            CustomDomainValues,
            CustomDomainFormProps,
            UpdateIngestEndpointEnvironmentResult
        >
            {...ingestEndpointEnvironmentUpdateProps}
        />
    );
};

export default IngestEndpointEnvironmentEditCustomDomain;
