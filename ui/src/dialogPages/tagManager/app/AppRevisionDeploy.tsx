import { FC } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import DeployAppRevisionGetQuery from '../../../gql/queries/DeployAppRevisionGetQuery';
import { DeployAppRevisionGetData } from '../../../gql/generated/DeployAppRevisionGetData';
import {
    AppRevisionDeployFormProps,
    AppRevisionDeployValues,
} from '../../../utils/forms/AppRevisionDeployDialogFormUtils';
import UpdateEnvironmentQuery from '../../../gql/mutations/UpdateEnvironmentQuery';
import { UpdateEnvironment } from '../../../gql/generated/UpdateEnvironment';
import AppRevisionDeployForm from '../../../components/organisms/Forms/AppRevisionDeployForm';

const AppRevisionDeploy: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DeployAppRevisionGetData,
        AppRevisionDeployValues,
        AppRevisionDeployFormProps,
        UpdateEnvironment
    > = {
        loadQuery: useQuery<DeployAppRevisionGetData>(DeployAppRevisionGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            environmentId: '',
        }),
        saveQuery: useMutation<UpdateEnvironment>(UpdateEnvironmentQuery),
        mapSaveData: (formValues: AppRevisionDeployValues) => ({
            environmentUpdateInput: {
                environment_id: formValues.environmentId,
                revision_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DeployAppRevisionGetData,
            formValidationValues: FormValidationResult<AppRevisionDeployValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Deploy Revision',
            title: 'Deploy Revision',
            handleDialogClose: props.handleDialogClose,
            availableEnvironments: formLoadedData.getRevision.app.environments
                .filter((_) => _.revision.id !== props.id)
                .map((_) => ({
                    key: _.id,
                    text: _.name,
                })),
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateEnvironment,
        pageComponent: AppRevisionDeployForm,
        validators: [],
        ...props,
    };

    return (
        <DialogPreloadForm<
            DeployAppRevisionGetData,
            AppRevisionDeployValues,
            AppRevisionDeployFormProps,
            UpdateEnvironment
        >
            {...duplicateProps}
        />
    );
};

export { AppRevisionDeploy };
