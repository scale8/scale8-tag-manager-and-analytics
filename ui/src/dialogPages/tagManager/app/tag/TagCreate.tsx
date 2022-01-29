import { Dispatch, FC, SetStateAction } from 'react';
import TagForm from '../../../../components/organisms/Forms/TagForm';
import { FormProps, FormValidationResult } from '../../../../hooks/form/useFormValidation';
import { ApolloError, useMutation } from '@apollo/client';
import CreateTagQuery from '../../../../gql/mutations/CreateTagQuery';
import { TagType } from '../../../../gql/generated/globalTypes';
import nameValidator from '../../../../utils/validators/nameValidator';
import { CreateTagResult } from '../../../../gql/generated/CreateTagResult';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { DialogForm, DialogFormProps } from '../../../abstractions/DialogForm';

export type TagValues = {
    name: string;
    type: TagType;
    comments: string;
    width: number | null;
    height: number | null;
    autoLoad: boolean;
};

export type TagFormProps = FormProps<TagValues> & {
    existingType: TagType | null;
};

const TagCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const revisionId = props.contextId;

    const tagCreateProps: DialogFormProps<TagValues, TagFormProps, CreateTagResult> = {
        buildInitialState: () => ({
            name: '',
            comments: '',
            autoLoad: true,
            type: TagType.HEAD,
            width: null,
            height: null,
        }),
        saveQuery: useMutation(CreateTagQuery),
        mapSaveData: (tagValues: TagValues) => ({
            tagCreateInput: {
                revision_id: revisionId,
                name: tagValues.name,
                type: tagValues.type,
                width: tagValues.width,
                height: tagValues.height,
                auto_load: tagValues.autoLoad,
                ...(tagValues.comments === ''
                    ? {}
                    : {
                          comments: tagValues.comments,
                      }),
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<TagValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Tag',
            title: 'Create Tag',
            formInfoProps: buildStandardFormInfo('tags', 'Create'),
            handleDialogClose: props.handleDialogClose,
            existingType: null,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createTag.id !== undefined,
        getSavedId: (formMutationData) => formMutationData?.createTag.id,
        pageComponent: TagForm,
        customValueSetter: (
            valueKey: string,
            value: any,
            values: TagValues,
            setValues: Dispatch<SetStateAction<TagValues>>,
        ) => {
            if (valueKey === 'type') {
                setValues({
                    ...values,
                    [valueKey]: value,
                    autoLoad: value === TagType.HEAD,
                });
            } else {
                setValues({
                    ...values,
                    [valueKey]: value,
                });
            }
        },
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Tag name too short',
            },
        ],
        ...props,
    };

    return <DialogForm<TagValues, TagFormProps, CreateTagResult> {...tagCreateProps} />;
};

export default TagCreate;
