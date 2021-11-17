import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { FetchAvailableAppPlatformRevisions } from '../../../gql/generated/FetchAvailableAppPlatformRevisions';
import FetchAvailableAppPlatformRevisionsQuery from '../../../gql/queries/FetchAvailableAppPlatformRevisionsQuery';
import AppPlatformRevisionForm from '../../../components/organisms/Forms/AppPlatformRevisionForm';
import LinkAppPlatformRevisionQuery from '../../../gql/mutations/LinkAppPlatformRevisionQuery';
import { LinkAppPlatformRevisionValues } from '../../../gql/generated/LinkAppPlatformRevisionValues';
import {
    FormWithMappedPlatformValuesResult,
    ModelWithPlatformDataMaps,
} from '../../../hooks/form/useFormWithMappedPlatformValues';
import { DataMap, PlatformDataMap } from '../../../types/DataMapsTypes';
import {
    MappedPlatformValues,
    ValuesWithMappedPlatformData,
} from '../../../types/MappedPlatformValuesTypes';
import { AppPlatformRevisionLinkInput, DataMapInput } from '../../../gql/generated/globalTypes';
import { mappedPlatformValuesToDataMapInput } from '../../../utils/MappedPlatformValuesUtils';
import { DialogPageProps } from '../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import { FormBaseProps } from '../../../types/props/forms/CommonFormProps';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';

export type ConnectPlatformRevisionAfterLoadLoadProps = DialogPageProps & {
    availableAppPlatformRevisions: {
        key: string;
        text: string;
        sub?: { key: string; text: string }[];
    }[];
    appPlatformRevisionsWithSettings: ModelWithPlatformDataMaps[];
    isUpdate: boolean;
    currentPlatformRevisionId?: string;
    currentPlatformSettings?: DataMap[];
};

export type AppPlatformRevisionBaseValues = {
    platformRevisionId: string;
};

export type AppPlatformRevisionValues = ValuesWithMappedPlatformData<AppPlatformRevisionBaseValues>;

export type AppPlatformRevisionFormProps =
    FormWithMappedPlatformValuesResult<AppPlatformRevisionValues> &
        FormBaseProps & {
            isEdit: boolean;
            initialId: string;
            availableAppPlatformRevisions: {
                key: string;
                text: string;
                sub?: { key: string; text: string }[];
            }[];
        };

export const buildAppPlatformRevisionLinkInput = (
    revisionId: string,
    platformRevisionId: string,
    mappedPlatformValues: MappedPlatformValues,
    preview?: boolean,
): AppPlatformRevisionLinkInput => {
    const data_maps: DataMapInput[] = mappedPlatformValuesToDataMapInput(mappedPlatformValues);

    return {
        revision_id: revisionId,
        platform_revision_id: platformRevisionId,
        data_maps,
        preview,
    };
};

const LinkPlatformRevision: FC<DialogPageProps> = (props: DialogPageProps) => {
    const revisionId = props.id;

    const linkPlatformRevisionProps: DialogPreloadFormProps<
        FetchAvailableAppPlatformRevisions,
        AppPlatformRevisionValues,
        AppPlatformRevisionFormProps,
        LinkAppPlatformRevisionValues
    > = {
        loadQuery: useQuery<FetchAvailableAppPlatformRevisions>(
            FetchAvailableAppPlatformRevisionsQuery,
            {
                variables: { id: revisionId },
            },
        ),
        buildInitialStatePreload: () => ({
            platformRevisionId: '',
        }),
        saveQuery: useMutation<LinkAppPlatformRevisionValues>(LinkAppPlatformRevisionQuery),
        mapSaveData: (appPlatformRevisionValues: AppPlatformRevisionValues) => {
            const appPlatformRevisionLinkInput = buildAppPlatformRevisionLinkInput(
                revisionId,
                appPlatformRevisionValues.platformRevisionId,
                appPlatformRevisionValues.mappedPlatformValues ?? [],
            );
            return { appPlatformRevisionLinkInput };
        },
        buildFormProps: (
            formLoadedData: FetchAvailableAppPlatformRevisions,
            formValidationValues: FormWithMappedPlatformValuesResult<AppPlatformRevisionValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Connect Platform Revision',
            title: 'Connect Platform Revision',
            formInfoProps: buildStandardFormInfo('appPlatformRevisions', 'Link'),
            handleDialogClose: props.handleDialogClose,
            isEdit: false,
            initialId: '',
            availableAppPlatformRevisions: formLoadedData.getRevision.app.app_platforms
                .filter(
                    (_) =>
                        !formLoadedData.getRevision.app_platform_revisions
                            .map((p) => p.platform_revision.platform.id)
                            .includes(_.platform.id),
                )
                .map((_) => ({
                    key: _.platform.id,
                    text: _.platform.name,
                    sub: _.platform.platform_revisions
                        .filter((_) => _.locked)
                        .map((r) => ({
                            key: r.id,
                            text: r.name,
                        })),
                })),
        }),
        checkSuccessfullySubmitted: (formMutationData) => {
            return formMutationData?.linkPlatformRevision !== undefined;
        },
        pageComponent: AppPlatformRevisionForm,
        validators: [],
        mappedPlatformValuesProps: {
            buildAvailableModelsWithPlatformDataMaps: (
                formLoadedData: FetchAvailableAppPlatformRevisions,
            ) => {
                const filteredPlatforms = formLoadedData.getRevision.app.app_platforms.filter(
                    (_) =>
                        !formLoadedData.getRevision.app_platform_revisions
                            .map((p) => p.platform_revision.platform.id)
                            .includes(_.platform.id),
                );
                return filteredPlatforms
                    .map((_) =>
                        _.platform.platform_revisions.map((r) => ({
                            id: r.id,
                            platformDataMaps: r.platform_settings as PlatformDataMap[],
                        })),
                    )
                    .flat();
            },
            idValueForModelWithPlatformDataMaps: 'platformRevisionId',
        },
        ...props,
    };

    return (
        <DialogPreloadForm<
            FetchAvailableAppPlatformRevisions,
            AppPlatformRevisionValues,
            AppPlatformRevisionFormProps,
            LinkAppPlatformRevisionValues
        >
            {...linkPlatformRevisionProps}
        />
    );
};

export default LinkPlatformRevision;
