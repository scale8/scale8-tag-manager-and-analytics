import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import UpdatePlatformRevisionGetQuery from '../../../gql/queries/UpdatePlatformRevisionGetQuery';
import UpdatePlatformRevisionQuery from '../../../gql/mutations/UpdatePlatformRevisionQuery';
import { UpdatePlatformRevision } from '../../../gql/generated/UpdatePlatformRevision';
import { UpdatePlatformRevisionGetData } from '../../../gql/generated/UpdatePlatformRevisionGetData';
import PlatformRevisionForm from '../../../components/organisms/Forms/PlatformRevisionForm';

export type PlatformRevisionValues = {
    name: string;
    comments: string;
};

export type PlatformRevisionFormProps = FormProps<PlatformRevisionValues>;

const PlatformRevisionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const platformRevisionUpdateProps: DialogPreloadFormProps<
        UpdatePlatformRevisionGetData,
        PlatformRevisionValues,
        PlatformRevisionFormProps,
        UpdatePlatformRevision
    > = {
        loadQuery: useQuery<UpdatePlatformRevisionGetData>(UpdatePlatformRevisionGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdatePlatformRevisionGetData) => ({
            name: formLoadedData.getPlatformRevision.name,
            comments: '',
        }),
        saveQuery: useMutation(UpdatePlatformRevisionQuery),
        mapSaveData: (revisionValues: PlatformRevisionValues) => ({
            revisionPlatformUpdateInput: {
                platform_revision_id: props.id,
                name: revisionValues.name,
                ...(revisionValues.comments === ''
                    ? {}
                    : {
                          comments: revisionValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdatePlatformRevisionGetData,
            formValidationValues: FormValidationResult<PlatformRevisionValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Revision',
            title: 'Update Revision',
            formInfoProps: buildStandardFormInfo('platformRevisions', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updatePlatformRevision,
        pageComponent: PlatformRevisionForm,
        validators: [],
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdatePlatformRevisionGetData,
            PlatformRevisionValues,
            PlatformRevisionFormProps,
            UpdatePlatformRevision
        >
            {...platformRevisionUpdateProps}
        />
    );
};

export default PlatformRevisionUpdate;
