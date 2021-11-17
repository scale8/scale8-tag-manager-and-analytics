import { Dispatch, FC, SetStateAction } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdatePlatformGetQuery from '../../../gql/queries/UpdatePlatformGetQuery';
import { UpdatePlatformGetData } from '../../../gql/generated/UpdatePlatformGetData';
import UpdatePlatformQuery from '../../../gql/mutations/UpdatePlatformQuery';
import PlatformForm from '../../../components/organisms/Forms/PlatformForm';
import { UpdatePlatformResult } from '../../../gql/generated/UpdatePlatformResult';
import { PlatformFormProps } from '../../../types/props/forms/PlatformFormProps';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import { uploadPlatformImage } from '../../../utils/FileUtils';
import { PlatformValidators, PlatformValues } from '../../../utils/forms/PlatformFormUtils';

const PlatformUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const accountId = props.contextId;
    const platformUpdateProps: DialogPreloadFormProps<
        UpdatePlatformGetData,
        PlatformValues,
        PlatformFormProps,
        UpdatePlatformResult
    > = {
        loadQuery: useQuery<UpdatePlatformGetData>(UpdatePlatformGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: UpdatePlatformGetData) => ({
            name: formLoadedData.getPlatform.name,
            description: formLoadedData.getPlatform.description,
            fileName: '',
        }),
        saveQuery: useMutation(UpdatePlatformQuery),
        mapSaveData: (formValues: PlatformValues) => ({
            platformUpdateInput: {
                platform_id: props.id,
                name: formValues.name,
                description: formValues.description,
                ...(formValues.fileName === '' ? {} : { logo: formValues.fileName }),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdatePlatformGetData,
            formValidationValues: FormValidationResult<PlatformValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            isUpdate: true,
            submitText: 'Update Platform',
            title: 'Update Platform',
            formInfoProps: buildStandardFormInfo('platforms', 'Update'),
            handleDialogClose: props.handleDialogClose,
            initialUrl: undefined,
            removeImage: (setUrl: Dispatch<SetStateAction<string>>) => {
                setUrl('');
                formValidationValues.setValues({
                    ...formValidationValues.values,
                    fileName: '',
                });
            },
            handleImageUpload: (
                selectedFile: File,
                setLoading: Dispatch<SetStateAction<boolean>>,
                setUrl: Dispatch<SetStateAction<string>>,
                setFetchError: Dispatch<SetStateAction<string | undefined>>,
            ) => {
                uploadPlatformImage(
                    selectedFile,
                    accountId,
                    setLoading,
                    setUrl,
                    setFetchError,
                    (fileName: string) =>
                        formValidationValues.setValues({
                            ...formValidationValues.values,
                            fileName,
                        }),
                );
            },
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updatePlatform,
        pageComponent: PlatformForm,
        validators: PlatformValidators,
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdatePlatformGetData,
            PlatformValues,
            PlatformFormProps,
            UpdatePlatformResult
        >
            {...platformUpdateProps}
        />
    );
};

export default PlatformUpdate;
