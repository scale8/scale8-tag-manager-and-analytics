import { FC } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../components/organisms/Forms/DuplicateDialogForm';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import DuplicatePlatformRevisionGetQuery from '../../../gql/queries/DuplicatePlatformRevisionGetQuery';
import { DuplicatePlatformRevisionGetData } from '../../../gql/generated/DuplicatePlatformRevisionGetData';
import { DuplicatePlatformRevision } from '../../../gql/generated/DuplicatePlatformRevision';
import DuplicatePlatformRevisionQuery from '../../../gql/mutations/DuplicatePlatformRevisionQuery';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../utils/forms/DuplicateDialogFormUtils';

const PlatformRevisionDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicatePlatformRevisionGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicatePlatformRevision
    > = {
        loadQuery: useQuery<DuplicatePlatformRevisionGetData>(DuplicatePlatformRevisionGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: DuplicatePlatformRevisionGetData) => ({
            name: `${formLoadedData.getPlatformRevision.name} Copy`,
        }),
        saveQuery: useMutation<DuplicatePlatformRevision>(DuplicatePlatformRevisionQuery),
        mapSaveData: (formValues: DuplicateValues) => ({
            duplicatePlatformRevisionInput: {
                new_name: formValues.name,
                platform_revision_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicatePlatformRevisionGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Revision',
            title: 'Create Revision',
            oldName: formLoadedData.getPlatformRevision.name,
            description: `Create a new Revision from ${formLoadedData.getPlatformRevision.name}?`,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicatePlatformRevision.id !== undefined,
        getSavedId: (formMutationData) => formMutationData?.duplicatePlatformRevision.id,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicatePlatformRevisionGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicatePlatformRevision
        >
            {...duplicateProps}
        />
    );
};

export default PlatformRevisionDuplicate;
