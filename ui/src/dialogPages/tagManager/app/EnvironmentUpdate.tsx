import { FC } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateEnvironmentGetQuery from '../../../gql/queries/UpdateEnvironmentGetQuery';
import { UpdateEnvironmentGetData } from '../../../gql/generated/UpdateEnvironmentGetData';
import UpdateEnvironmentQuery from '../../../gql/mutations/UpdateEnvironmentQuery';
import EnvironmentForm from '../../../components/organisms/Forms/EnvironmentForm';
import { EnvironmentUpdateInput } from '../../../gql/generated/globalTypes';
import { EnvironmentFormProps } from './EnvironmentCreate';
import { UpdateEnvironment } from '../../../gql/generated/UpdateEnvironment';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import {
    EnvironmentUpdateValidators,
    EnvironmentValues,
} from '../../../utils/forms/EnvironmentFormUtils';

const EnvironmentUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const appId = props.contextId;

    const environmentUpdateProps: DialogPreloadFormProps<
        UpdateEnvironmentGetData,
        EnvironmentValues,
        EnvironmentFormProps,
        UpdateEnvironment
    > = {
        loadQuery: useQuery<UpdateEnvironmentGetData>(UpdateEnvironmentGetQuery, {
            variables: { id: props.id, appId },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateEnvironmentGetData) => ({
            name: formLoadedData.getEnvironment.name,
            url: formLoadedData.getEnvironment.url ?? '',
            revisionId: formLoadedData.getEnvironment.revision?.id ?? '',
            certificate: '',
            key: '',
            comments: '',
        }),
        saveQuery: useMutation(UpdateEnvironmentQuery),
        mapSaveData: (environmentValues: EnvironmentValues) => {
            const environmentUpdateInput: EnvironmentUpdateInput = {
                environment_id: props.id,
                revision_id: environmentValues.revisionId,
                name: environmentValues.name,
                ...(environmentValues.comments === ''
                    ? {}
                    : {
                          comments: environmentValues.comments,
                      }),
            };

            if (environmentValues.url !== '') {
                environmentUpdateInput.url = environmentValues.url;
            }

            if (environmentValues.certificate !== '') {
                environmentUpdateInput.cert_pem = environmentValues.certificate;
            }

            if (environmentValues.key !== '') {
                environmentUpdateInput.key_pem = environmentValues.key;
            }

            return { environmentUpdateInput };
        },
        buildFormProps: (
            formLoadedData: UpdateEnvironmentGetData,
            formValidationValues: FormValidationResult<EnvironmentValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Environment',
            title: 'Update Environment',
            formInfoProps: buildStandardFormInfo('appEnvironments', 'Update'),
            handleDialogClose: props.handleDialogClose,
            availableRevisions: formLoadedData.getApp.revisions
                .filter((_) => _.locked)
                .map((_) => ({
                    key: _.id,
                    text: _.name,
                })),
            hasCustomDomain: formLoadedData.getEnvironment.custom_domain !== null,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateEnvironment,
        pageComponent: EnvironmentForm,
        validators: EnvironmentUpdateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateEnvironmentGetData,
            EnvironmentValues,
            EnvironmentFormProps,
            UpdateEnvironment
        >
            {...environmentUpdateProps}
        />
    );
};

export { EnvironmentUpdate };
