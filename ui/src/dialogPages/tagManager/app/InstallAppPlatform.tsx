import { FC } from 'react';
import { FormProps, FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import AppPlatformForm from '../../../components/organisms/Forms/AppPlatformForm';
import FetchAvailableAppPlatformsQuery from '../../../gql/queries/FetchAvailableAppPlatformsQuery';
import { FetchAvailableAppPlatforms } from '../../../gql/generated/FetchAvailableAppPlatforms';
import InstallAppPlatformQuery from '../../../gql/mutations/InstallAppPlatformQuery';
import { InstallPlatform } from '../../../gql/generated/InstallPlatform';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';

export type AppPlatformValues = {
    platformId: string;
};

export type AppPlatformFormProps = FormProps<AppPlatformValues> & {
    availableAppPlatforms: { key: string; text: string }[];
};

const InstallAppPlatform: FC<DialogPageProps> = (props: DialogPageProps) => {
    const appId = props.contextId;

    const installAppPlatformProps: DialogPreloadFormProps<
        FetchAvailableAppPlatforms,
        AppPlatformValues,
        AppPlatformFormProps,
        InstallPlatform
    > = {
        loadQuery: useQuery<FetchAvailableAppPlatforms>(FetchAvailableAppPlatformsQuery, {
            variables: { id: appId },
        }),
        buildInitialStatePreload: () => ({
            platformId: '',
        }),
        saveQuery: useMutation<InstallPlatform>(InstallAppPlatformQuery),
        mapSaveData: (appPlatformValues: AppPlatformValues) => ({
            appInstallPlatformInput: {
                app_id: appId,
                platform_id: appPlatformValues.platformId,
            },
        }),
        buildFormProps: (
            formLoadedData: FetchAvailableAppPlatforms,
            formValidationValues: FormValidationResult<AppPlatformValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Install Platform',
            title: 'Install Platform',
            availableAppPlatforms: formLoadedData.getPublicPlatforms
                .filter(
                    (_) =>
                        !formLoadedData.getApp.app_platforms
                            .map((p) => p.platform.id)
                            .includes(_.id),
                )
                .map((_) => ({
                    key: _.id,
                    text: _.name,
                })),
            formInfoProps: buildStandardFormInfo('appPlatforms', 'Create'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.installPlatform.id !== undefined,
        pageComponent: AppPlatformForm,
        validators: [],
        ...props,
    };

    return (
        <DialogPreloadForm<
            FetchAvailableAppPlatforms,
            AppPlatformValues,
            AppPlatformFormProps,
            InstallPlatform
        >
            {...installAppPlatformProps}
        />
    );
};

export default InstallAppPlatform;
