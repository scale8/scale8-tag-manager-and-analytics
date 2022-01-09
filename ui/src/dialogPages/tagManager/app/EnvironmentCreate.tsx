import { FC } from 'react';
import EnvironmentForm from '../../../components/organisms/Forms/EnvironmentForm';
import { FormProps, FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import CreateEnvironmentQuery from '../../../gql/mutations/CreateEnvironmentQuery';
import FetchAppRevisionsQuery from '../../../gql/queries/FetchAppRevisionsQuery';
import { AppRevisionsData } from '../../../gql/generated/AppRevisionsData';
import { EnvironmentCreateInput } from '../../../gql/generated/globalTypes';
import { CreateEnvironment } from '../../../gql/generated/CreateEnvironment';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import {
    EnvironmentCreateValidators,
    EnvironmentValues,
} from '../../../utils/forms/EnvironmentFormUtils';

export type EnvironmentFormProps = FormProps<EnvironmentValues> & {
    availableRevisions: { key: string; text: string }[];
};

const EnvironmentCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const appId = props.contextId;

    const environmentCreateProps: DialogPreloadFormProps<
        AppRevisionsData,
        EnvironmentValues,
        EnvironmentFormProps,
        CreateEnvironment
    > = {
        loadQuery: useQuery<AppRevisionsData>(FetchAppRevisionsQuery, {
            variables: { id: appId },
        }),
        buildInitialStatePreload: () => ({
            name: '',
            url: '',
            revisionId: '',
            variables: [],
            comments: '',
        }),
        saveQuery: useMutation(CreateEnvironmentQuery),
        mapSaveData: (environmentValues: EnvironmentValues) => {
            const environmentCreateInput: EnvironmentCreateInput = {
                app_id: appId,
                revision_id: environmentValues.revisionId,
                name: environmentValues.name,
                ...(environmentValues.comments === ''
                    ? {}
                    : {
                          comments: environmentValues.comments,
                      }),
            };

            if (environmentValues.url !== '') {
                environmentCreateInput.url = environmentValues.url;
            }

            if (environmentValues.variables && environmentValues.variables.length > 0) {
                environmentCreateInput.env_vars = environmentValues.variables;
            }

            return { environmentCreateInput };
        },
        buildFormProps: (
            formLoadedData: AppRevisionsData,
            formValidationValues: FormValidationResult<EnvironmentValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Environment',
            title: 'Create Environment',
            formInfoProps: buildStandardFormInfo('appEnvironments', 'Create'),
            handleDialogClose: props.handleDialogClose,
            availableRevisions: formLoadedData.getApp.revisions
                .filter((_) => _.locked)
                .map((_) => ({
                    key: _.id,
                    text: _.name,
                })),
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createEnvironment.id !== undefined,
        getSavedId: (formMutationData) => formMutationData?.createEnvironment.id,
        pageComponent: EnvironmentForm,
        validators: EnvironmentCreateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            AppRevisionsData,
            EnvironmentValues,
            EnvironmentFormProps,
            CreateEnvironment
        >
            {...environmentCreateProps}
        />
    );
};

export default EnvironmentCreate;
