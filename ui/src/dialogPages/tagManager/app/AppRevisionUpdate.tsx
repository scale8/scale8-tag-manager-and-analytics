import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateAppRevisionGetQuery from '../../../gql/queries/UpdateAppRevisionGetQuery';
import { UpdateAppRevisionGetData } from '../../../gql/generated/UpdateAppRevisionGetData';
import UpdateAppRevisionQuery from '../../../gql/mutations/UpdateAppRevisionQuery';
import AppRevisionForm from '../../../components/organisms/Forms/AppRevisionForm';
import { UpdateRevision } from '../../../gql/generated/UpdateRevision';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';

export type AppRevisionValues = {
    name: string;
    comments: string;
};

export type AppRevisionFormProps = FormProps<AppRevisionValues>;

const AppRevisionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const appRevisionUpdateProps: DialogPreloadFormProps<
        UpdateAppRevisionGetData,
        AppRevisionValues,
        AppRevisionFormProps,
        UpdateRevision
    > = {
        loadQuery: useQuery<UpdateAppRevisionGetData>(UpdateAppRevisionGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateAppRevisionGetData) => ({
            name: formLoadedData.getRevision.name,
            comments: '',
        }),
        saveQuery: useMutation(UpdateAppRevisionQuery),
        mapSaveData: (revisionValues: AppRevisionValues) => ({
            revisionUpdateInput: {
                revision_id: props.id,
                name: revisionValues.name,
                ...(revisionValues.comments === ''
                    ? {}
                    : {
                          comments: revisionValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateAppRevisionGetData,
            formValidationValues: FormValidationResult<AppRevisionValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Revision',
            title: 'Update Revision',
            formInfoProps: buildStandardFormInfo('appRevisions', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateRevision,
        pageComponent: AppRevisionForm,
        validators: [],
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateAppRevisionGetData,
            AppRevisionValues,
            AppRevisionFormProps,
            UpdateRevision
        >
            {...appRevisionUpdateProps}
        />
    );
};

export default AppRevisionUpdate;
