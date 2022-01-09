import { FC } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateEnvironmentQuery from '../../../gql/mutations/UpdateEnvironmentQuery';
import { EnvironmentUpdateInput } from '../../../gql/generated/globalTypes';
import { UpdateEnvironment } from '../../../gql/generated/UpdateEnvironment';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import {
    CustomDomainFormProps,
    CustomDomainValidators,
    CustomDomainValues,
} from '../../../utils/forms/CustomDomainFormUtils';
import CustomDomainForm from '../../../components/organisms/Forms/CustomDomainForm';
import UpdateCustomDomainGetQuery from '../../../gql/queries/UpdateCustomDomainGetQuery';
import { UpdateCustomDomainGetQueryData } from '../../../gql/generated/UpdateCustomDomainGetQueryData';

const EnvironmentEditCustomDomain: FC<DialogPageProps> = (props: DialogPageProps) => {
    const environmentUpdateProps: DialogPreloadFormProps<
        UpdateCustomDomainGetQueryData,
        CustomDomainValues,
        CustomDomainFormProps,
        UpdateEnvironment
    > = {
        loadQuery: useQuery<UpdateCustomDomainGetQueryData>(UpdateCustomDomainGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateCustomDomainGetQueryData) => ({
            domain: formLoadedData.getEnvironment.custom_domain ?? '',
            certificate: '',
            key: '',
        }),
        saveQuery: useMutation(UpdateEnvironmentQuery),
        mapSaveData: (environmentValues: CustomDomainValues) => {
            const environmentUpdateInput: EnvironmentUpdateInput = {
                environment_id: props.id,
                custom_domain: environmentValues.domain,
                cert_pem: environmentValues.certificate,
                key_pem: environmentValues.key,
            };

            return { environmentUpdateInput };
        },
        buildFormProps: (
            formLoadedData: UpdateCustomDomainGetQueryData,
            formValidationValues: FormValidationResult<CustomDomainValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: formLoadedData.getEnvironment.custom_domain
                ? 'Edit Custom Domain'
                : 'Create Custom Domain',
            title: formLoadedData.getEnvironment.custom_domain
                ? 'Edit Custom Domain'
                : 'Create Custom Domain',
            formInfoProps: buildStandardFormInfo('appEnvironments', 'EditCustomDomain'),
            handleDialogClose: props.handleDialogClose,
            installDomain: formLoadedData.getEnvironment.install_domain,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateEnvironment,
        pageComponent: CustomDomainForm,
        validators: CustomDomainValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateCustomDomainGetQueryData,
            CustomDomainValues,
            CustomDomainFormProps,
            UpdateEnvironment
        >
            {...environmentUpdateProps}
        />
    );
};

export default EnvironmentEditCustomDomain;
