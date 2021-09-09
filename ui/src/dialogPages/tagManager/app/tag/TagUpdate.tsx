import { FC } from 'react';
import { FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateTagGetQuery from '../../../../gql/queries/UpdateTagGetQuery';
import { UpdateTagGetData } from '../../../../gql/generated/UpdateTagGetData';
import UpdateTagQuery from '../../../../gql/mutations/UpdateTagQuery';
import TagForm from '../../../../components/organisms/Forms/TagForm';
import nameValidator from '../../../../utils/validators/nameValidator';
import { TagFormProps, TagValues } from './TagCreate';
import { UpdateTagResult } from '../../../../gql/generated/UpdateTagResult';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { TagType } from '../../../../gql/generated/globalTypes';

const TagUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const tagUpdateProps: DialogPreloadFormProps<
        UpdateTagGetData,
        TagValues,
        TagFormProps,
        UpdateTagResult
    > = {
        loadQuery: useQuery<UpdateTagGetData>(UpdateTagGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateTagGetData) => ({
            name: formLoadedData.getTag.name,
            comments: '',
            type: formLoadedData.getTag.type,
            width: formLoadedData.getTag.width,
            height: formLoadedData.getTag.height,
            autoLoad: formLoadedData.getTag.auto_load ?? false,
        }),
        saveQuery: useMutation(UpdateTagQuery),
        mapSaveData: (tagValues: TagValues) => ({
            tagUpdateInput: {
                tag_id: props.id,
                name: tagValues.name,
                width: tagValues.width,
                height: tagValues.height,
                ...(tagValues.type === TagType.HEAD ? { auto_load: tagValues.autoLoad } : {}),
                ...(tagValues.comments === ''
                    ? {}
                    : {
                          comments: tagValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateTagGetData,
            formValidationValues: FormValidationResult<TagValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Tag',
            title: 'Update Tag',
            formInfoProps: buildStandardFormInfo('tags', 'Update'),
            handleDialogClose: props.handleDialogClose,
            existingType: formLoadedData.getTag.type,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateTag,
        pageComponent: TagForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Tag name too short',
            },
        ],
        ...props,
    };

    return (
        <DialogPreloadForm<UpdateTagGetData, TagValues, TagFormProps, UpdateTagResult>
            {...tagUpdateProps}
        />
    );
};

export { TagUpdate };
