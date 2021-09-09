import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import DuplicateTagQuery from '../../../../gql/mutations/DuplicateTagQuery';
import DuplicateDialogForm, {
    DuplicateDialogProps,
} from '../../../../components/organisms/Forms/DuplicateDialogForm';
import DuplicateTagGetQuery from '../../../../gql/queries/DuplicateTagGetQuery';
import { DuplicateTagGetData } from '../../../../gql/generated/DuplicateTagGetData';
import { DuplicateTag } from '../../../../gql/generated/DuplicateTag';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import {
    DuplicateValidators,
    DuplicateValues,
} from '../../../../utils/forms/DuplicateDialogFormUtils';

const TagDuplicate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const duplicateProps: DialogPreloadFormProps<
        DuplicateTagGetData,
        DuplicateValues,
        DuplicateDialogProps,
        DuplicateTag
    > = {
        loadQuery: useQuery<DuplicateTagGetData>(DuplicateTagGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: DuplicateTagGetData) => ({
            name: `${formLoadedData.getTag.name} Copy`,
        }),
        saveQuery: useMutation<DuplicateTag>(DuplicateTagQuery),
        mapSaveData: (formValues: DuplicateValues) => ({
            tagDuplicateInput: {
                name: formValues.name,
                tag_id: props.id,
            },
        }),
        buildFormProps: (
            formLoadedData: DuplicateTagGetData,
            formValidationValues: FormValidationResult<DuplicateValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Tag',
            title: 'Create Tag',
            handleDialogClose: props.handleDialogClose,
            oldName: formLoadedData.getTag.name,
            description: `Create a new Tag from ${formLoadedData.getTag.name}?`,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.duplicateTag.id !== undefined,
        pageComponent: DuplicateDialogForm,
        validators: DuplicateValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<DuplicateTagGetData, DuplicateValues, DuplicateDialogProps, DuplicateTag>
            {...duplicateProps}
        />
    );
};

export { TagDuplicate };
