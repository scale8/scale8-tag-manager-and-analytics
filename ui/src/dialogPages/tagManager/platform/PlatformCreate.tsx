import { Dispatch, FC, SetStateAction } from 'react';
import PlatformForm from '../../../components/organisms/Forms/PlatformForm';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation } from '@apollo/client';
import CreatePlatformQuery from '../../../gql/mutations/CreatePlatformQuery';
import { CreatePlatformResult } from '../../../gql/generated/CreatePlatformResult';
import { PlatformFormProps } from '../../../types/props/forms/PlatformFormProps';
import { DialogPageProps } from '../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import SimpleMessage from '../../../components/molecules/SimpleMessage';
import { uploadPlatformImage } from '../../../utils/FileUtils';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { PlatformValidators, PlatformValues } from '../../../utils/forms/PlatformFormUtils';
import { DialogForm, DialogFormProps } from '../../abstractions/DialogForm';
import { useLoggedInState } from '../../../context/AppContext';

const PlatformCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const accountId = props.contextId;
    const { loggedInUserState } = useLoggedInState();
    const { userIsAdmin } = loggedInUserState;

    const platformCreateProps: DialogFormProps<
        PlatformValues,
        PlatformFormProps,
        CreatePlatformResult
    > = {
        buildInitialState: () => ({
            name: '',
            description: '',
            fileName: '',
            type: PlatformType.TEMPLATED,
        }),
        saveQuery: useMutation(CreatePlatformQuery),
        mapSaveData: (platformValues: PlatformValues) => ({
            platformCreateInput: {
                tag_manager_account_id: accountId,
                name: platformValues.name,
                description: platformValues.description,
                type: platformValues.type ?? PlatformType.TEMPLATED,
                ...(platformValues.fileName === '' ? {} : { logo: platformValues.fileName }),
            },
        }),
        buildFormProps: (
            formValidationValues: FormValidationResult<PlatformValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Create Platform',
            title: 'Create Platform',
            formInfoProps: buildStandardFormInfo('platforms', 'Create'),
            handleDialogClose: props.handleDialogClose,
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
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createPlatform.id !== undefined,
        pageComponent: PlatformForm,
        validators: PlatformValidators,
        ...props,
    };

    if (!userIsAdmin) {
        return (
            <SimpleMessage handleDialogClose={props.handleDialogClose}>
                <>
                    This is currently in alpha, we are only working with a limited number of
                    developers at the time. <br />
                    If you like to join the program, please contact us for more information.
                </>
            </SimpleMessage>
        );
    }

    return (
        <DialogForm<PlatformValues, PlatformFormProps, CreatePlatformResult>
            {...platformCreateProps}
        />
    );
};

export default PlatformCreate;
