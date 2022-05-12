import { FC } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateAppRevisionQuery from '../../../gql/mutations/DuplicateAppRevisionQuery';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../components/organisms/Forms/DuplicateDialogForm';
import DuplicateAppRevisionGetQuery from '../../../gql/queries/DuplicateAppRevisionGetQuery';
import { DuplicateAppRevisionGetData } from '../../../gql/generated/DuplicateAppRevisionGetData';
import { DuplicateAppRevision } from '../../../gql/generated/DuplicateAppRevision';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../utils/forms/DuplicateDialogFormUtils';
import { generateRevisionName } from '../../../../../common/utils/GenerateRevisionName';

const AppRevisionDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicateAppRevisionGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateAppRevision
    > = {
        loadQuery: useQuery<DuplicateAppRevisionGetData>(DuplicateAppRevisionGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: () => ({
            name: generateRevisionName(),
        }),
        saveQuery: useMutation<DuplicateAppRevision>(DuplicateAppRevisionQuery),
        mapSaveData: (formValues: DuplicateValues) => ({
            duplicateRevisionInput: {
                new_name: formValues.name,
                revision_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateAppRevisionGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Revision',
            title: 'Create Revision',
            oldName: formLoadedData.getRevision.name,
            description: `Create a new Revision from ${formLoadedData.getRevision.name}?`,
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicateRevision.id !== undefined,
        getSavedId: (formMutationData) => formMutationData?.duplicateRevision.id,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            DuplicateAppRevisionGetData,
            DuplicateValues,
            DuplicateDialogProps,
            DuplicateAppRevision
        >
            {...duplicateProps}
        />
    );
};

export default AppRevisionDuplicate;
