import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import FetchAppPlatformRevisionQuery from '../../../gql/queries/FetchAppPlatformRevisionQuery';
import { FetchAppPlatformRevisionData } from '../../../gql/generated/FetchAppPlatformRevisionData';
import { DataMap, PlatformDataMap } from '../../../types/DataMapsTypes';
import { FormWithMappedPlatformValuesResult } from '../../../hooks/form/useFormWithMappedPlatformValues';
import AppPlatformRevisionForm from '../../../components/organisms/Forms/AppPlatformRevisionForm';
import { LinkAppPlatformRevisionValues } from '../../../gql/generated/LinkAppPlatformRevisionValues';
import LinkAppPlatformRevisionQuery from '../../../gql/mutations/LinkAppPlatformRevisionQuery';
import {
    AppPlatformRevisionFormProps,
    AppPlatformRevisionValues,
    buildAppPlatformRevisionLinkInput,
} from './LinkPlatformRevision';
import { mappedPlatformValuesFromDataMapsWithValues } from '../../../utils/MappedPlatformValuesUtils';
import { DialogPageProps } from '../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import AppPlatformRevisionPreviewForm from '../../../components/organisms/Forms/AppPlatformRevisionPreviewForm';
import {
    FormLoadedData,
    FormMutationData,
    FormValidationResult,
} from '../../../hooks/form/useFormValidation';
import { modelsLinkReducer } from '../../../utils/ArrayUtils';

const AppPlatformRevisionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const revisionId = props.contextId;

    const appPlatformRevisionUpdateProps: DialogPreloadFormProps<
        FetchAppPlatformRevisionData,
        AppPlatformRevisionValues,
        AppPlatformRevisionFormProps,
        LinkAppPlatformRevisionValues
    > = {
        loadQuery: useQuery<FetchAppPlatformRevisionData>(FetchAppPlatformRevisionQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (formLoadedData: FetchAppPlatformRevisionData) => {
            const platformRevisionId = formLoadedData.getAppPlatformRevision.platform_revision.id;

            const platformRevisions =
                formLoadedData.getAppPlatformRevision.platform_revision.platform.platform_revisions.filter(
                    (_) => _.locked,
                );

            const formInitialState = { platformRevisionId };

            const initialModel = platformRevisions
                .map((_) => ({
                    id: _.id,
                    platformDataMaps: _.platform_settings,
                }))
                .find(
                    (modelWithPlatformDataMap) =>
                        modelWithPlatformDataMap.id === platformRevisionId,
                );

            return initialModel
                ? {
                      ...formInitialState,
                      mappedPlatformValues: mappedPlatformValuesFromDataMapsWithValues(
                          initialModel.platformDataMaps as PlatformDataMap[],
                          formLoadedData.getAppPlatformRevision.platform_settings as DataMap[],
                      ),
                  }
                : formInitialState;
        },
        saveQuery: useMutation<LinkAppPlatformRevisionValues>(LinkAppPlatformRevisionQuery),
        mapSaveData: (appPlatformRevisionValues: AppPlatformRevisionValues) => {
            const appPlatformRevisionLinkInput = buildAppPlatformRevisionLinkInput(
                revisionId,
                appPlatformRevisionValues.platformRevisionId,
                appPlatformRevisionValues.mappedPlatformValues ?? [],
                true,
            );
            return { appPlatformRevisionLinkInput };
        },
        buildFormProps: (
            formLoadedData: FetchAppPlatformRevisionData,
            formValidationValues: FormWithMappedPlatformValuesResult<AppPlatformRevisionValues>,
            gqlError?: ApolloError,
        ) => {
            const platformRevisionId = formLoadedData.getAppPlatformRevision.platform_revision.id;

            return {
                ...formValidationValues,
                gqlError,
                submitText: 'Change Platform Revision',
                title: 'Change Platform Revision',
                formInfoProps: buildStandardFormInfo('appPlatformRevisions', 'Update'),
                handleDialogClose: props.handleDialogClose,
                isEdit: true,
                initialId: platformRevisionId,
                availableAppPlatformRevisions:
                    formLoadedData.getAppPlatformRevision.platform_revision.platform.platform_revisions
                        .filter((_) => _.locked)
                        .map((_) => ({
                            key: _.id,
                            text: _.name,
                        })),
            };
        },
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.linkPlatformRevision !== undefined,
        pageComponent: AppPlatformRevisionForm,
        validators: [],
        mappedPlatformValuesProps: {
            buildAvailableModelsWithPlatformDataMaps: (
                formLoadedData: FetchAppPlatformRevisionData,
            ) => {
                const platformRevisions =
                    formLoadedData.getAppPlatformRevision.platform_revision.platform.platform_revisions.filter(
                        (_) => _.locked,
                    );
                return platformRevisions.map((_) => ({
                    id: _.id,
                    platformDataMaps: _.platform_settings as PlatformDataMap[],
                }));
            },
            idValueForModelWithPlatformDataMaps: 'platformRevisionId',
            buildExistingModelData: (formLoadedData) => ({
                id: formLoadedData.getAppPlatformRevision.platform_revision.id,
                dataMaps: formLoadedData.getAppPlatformRevision.platform_settings as DataMap[],
            }),
        },
        previewForm: {
            previewPage: AppPlatformRevisionPreviewForm,
            mapPreviewConfirmData: (appPlatformRevisionValues: AppPlatformRevisionValues) => {
                const appPlatformRevisionLinkInput = buildAppPlatformRevisionLinkInput(
                    revisionId,
                    appPlatformRevisionValues.platformRevisionId,
                    appPlatformRevisionValues.mappedPlatformValues ?? [],
                );
                return { appPlatformRevisionLinkInput };
            },
            confirmQuery: useMutation<LinkAppPlatformRevisionValues>(LinkAppPlatformRevisionQuery),
            buildPreviewFormProps: (
                formValidationValues: FormValidationResult<AppPlatformRevisionValues>,
                mutationResult?: LinkAppPlatformRevisionValues,
                gqlError?: ApolloError,
                formLoadedData?: FormLoadedData,
            ) => {
                const buildGroups = (data: FormMutationData | LinkAppPlatformRevisionValues) => {
                    const modelsLinkMap = (
                        data as LinkAppPlatformRevisionValues
                    ).linkPlatformRevision.reduce(
                        modelsLinkReducer,
                        new Map<string, { name: string; id: string }[]>(),
                    );

                    const groups: {
                        title: string;
                        items: { name: string; id: string }[];
                    }[] = [];

                    [
                        { model: 'RuleGroup', label: 'Rule Groups' },
                        { model: 'Rule', label: 'Rules' },
                        { model: 'Event', label: 'Events' },
                        {
                            model: 'ConditionRule',
                            label: 'Condition Rules',
                        },
                        {
                            model: 'ExceptionRule',
                            label: 'Exception Rules',
                        },
                        {
                            model: 'ActionGroupDistribution',
                            label: 'Action Group Distributions',
                        },
                        { model: 'ActionGroup', label: 'Action Groups' },
                        { model: 'Action', label: 'Actions' },
                        { model: 'DataMap', label: 'Data Maps' },
                        {
                            model: 'RepeatedDataMap',
                            label: 'Repeated Data Maps',
                        },
                    ].forEach((_) => {
                        const items = modelsLinkMap.get(_.model);
                        if (items !== undefined) {
                            groups.push({
                                title: `${_.label} (${items.length})`,
                                items,
                            });
                        }
                    });

                    return groups;
                };

                return {
                    ...formValidationValues,
                    gqlError,
                    submitText: 'Confirm',
                    title: 'Change Platform Revision',
                    formInfoProps: buildStandardFormInfo('appPlatformRevisions', 'Link'),
                    handleDialogClose: props.handleDialogClose,
                    revisionName: (
                        formLoadedData as FetchAppPlatformRevisionData
                    ).getAppPlatformRevision.platform_revision.platform.platform_revisions.filter(
                        (_) => _.id === formValidationValues.values.platformRevisionId,
                    )[0].name,
                    groups: mutationResult ? buildGroups(mutationResult) : [],
                };
            },
        },
        ...props,
    };

    return (
        <DialogPreloadForm<
            FetchAppPlatformRevisionData,
            AppPlatformRevisionValues,
            AppPlatformRevisionFormProps,
            LinkAppPlatformRevisionValues
        >
            {...appPlatformRevisionUpdateProps}
        />
    );
};

export default AppPlatformRevisionUpdate;
