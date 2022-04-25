import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import ActionForm from '../../../../components/organisms/Forms/ActionForm';
import { UpdateActionGetData } from '../../../../gql/generated/UpdateActionGetData';
import { FormWithMappedPlatformValuesResult } from '../../../../hooks/form/useFormWithMappedPlatformValues';
import nameValidator from '../../../../utils/validators/nameValidator';
import { MappedPlatformValues } from '../../../../types/MappedPlatformValuesTypes';
import { ActionUpdateInput, DataMapInput } from '../../../../gql/generated/globalTypes';
import {
    mappedPlatformValuesFromDataMapsWithValues,
    mappedPlatformValuesToDataMapInput,
} from '../../../../utils/MappedPlatformValuesUtils';
import { DataMap, PlatformDataMap } from '../../../../types/DataMapsTypes';
import { AppPlatformRevision, PlatformAction } from '../../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../../types/IngestEndpointsTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import UpdateActionGetQuery from '../../../../gql/queries/UpdateActionGetQuery';
import { FormMutationData, SelectValueWithSub } from '../../../../hooks/form/useFormValidation';
import { controlledSelectValuesFindByInnerKey } from '../../../../utils/ControlledSelectUtils';
import UpdateActionQuery from '../../../../gql/mutations/UpdateActionQuery';
import { UpdateActionResult } from '../../../../gql/generated/UpdateActionResult';
import { ActionFormProps, ActionValues } from '../../../../types/props/forms/ActionFormProps';
import { getActionIcon } from '../../../../utils/TypeIconsUtils';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { useConfigState } from '../../../../context/AppContext';

const buildActionUpdateInput = (
    actionName: string,
    actionId: string,
    mappedPlatformValues: MappedPlatformValues,
    comments: string,
): ActionUpdateInput => {
    const data_maps: DataMapInput[] = mappedPlatformValuesToDataMapInput(mappedPlatformValues);

    return {
        action_id: actionId,
        name: actionName,
        data_maps,
        ...(comments === '' ? {} : { comments }),
    };
};

export const buildActionName = (
    platformActionId: string | undefined,
    platformActions: SelectValueWithSub[],
): string => {
    if (!platformActionId) {
        return '';
    }

    const selectedAction = controlledSelectValuesFindByInnerKey(platformActions, platformActionId);

    if (!selectedAction) {
        return '';
    }

    return selectedAction.text;
};

const buildPlatformActions = (formLoadedData: UpdateActionGetData) =>
    formLoadedData.getActionGroupDistribution.revision.app_platform_revisions.map((_) => ({
        key: _.platform_revision.platform.id,
        text: _.platform_revision.platform.name,
        sub: _.platform_revision.platform_actions.map((a) => {
            const Icon = getActionIcon(a.icon);

            return {
                key: a.id,
                text: a.name,
                iconType: a.icon ?? undefined,
                icon: <Icon />,
                description: a.description,
            };
        }),
    }));

const builtNameUsed = (formLoadedData: UpdateActionGetData): boolean =>
    formLoadedData.getAction.name ===
    buildActionName(
        formLoadedData.getAction.platform_action.id,
        buildPlatformActions(formLoadedData),
    );

const ActionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { consentPurposes, consentVendors } = useConfigState();

    const actionUpdateProps: DialogPreloadFormProps<
        UpdateActionGetData,
        ActionValues,
        ActionFormProps,
        UpdateActionResult
    > = {
        loadQuery: useQuery<UpdateActionGetData>(UpdateActionGetQuery, {
            variables: { id: props.id, agdId: props.contextId },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateActionGetData) => {
            const mappedPlatformValues: MappedPlatformValues =
                mappedPlatformValuesFromDataMapsWithValues(
                    formLoadedData.getAction.platform_action
                        .platform_data_maps as PlatformDataMap[],
                    formLoadedData.getAction.data_maps as DataMap[],
                );

            return {
                platformActionId: formLoadedData.getAction.platform_action.id,
                name: formLoadedData.getAction.name,
                mappedPlatformValues,
                comments: '',
            };
        },
        saveQuery: useMutation(UpdateActionQuery),
        mapSaveData: (actionValues: ActionValues) => {
            return {
                actionUpdateInput: buildActionUpdateInput(
                    actionValues.name,
                    props.id,
                    actionValues.mappedPlatformValues ?? [],
                    actionValues.comments,
                ),
            };
        },
        buildFormProps: (
            formLoadedData: UpdateActionGetData,
            formValidationValues: FormWithMappedPlatformValuesResult<ActionValues>,
            gqlError?: ApolloError,
        ): ActionFormProps => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Update Action',
            title: 'Update Action',
            formInfoProps: buildStandardFormInfo('actions', 'Update'),
            handleDialogClose: props.handleDialogClose,
            update: true,
            generateName: builtNameUsed(formLoadedData),
            initialPlatformId: formLoadedData.getAction.platform_action.platform.id,
            appPlatformRevisions: formLoadedData.getActionGroupDistribution.revision
                .app_platform_revisions as AppPlatformRevision[],
            ingestEndpoints: formLoadedData.getActionGroupDistribution.revision.app
                .tag_manager_account.org.data_manager_account
                .ingest_endpoints as IngestEndpointForEnvironmentSelection[],
            environments: formLoadedData.getActionGroupDistribution.revision.app.environments,
            revisions: formLoadedData.getActionGroupDistribution.revision.app.revisions,
            consentPurposes,
            consentVendors,
            platformActions: buildPlatformActions(formLoadedData),
        }),
        checkSuccessfullySubmitted: (
            formMutationData: FormMutationData | UpdateActionResult,
        ): boolean => !!formMutationData?.updateAction,
        pageComponent: ActionForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Action name too short',
            },
        ],
        mappedPlatformValuesProps: {
            buildAvailableModelsWithPlatformDataMaps: (formLoadedData: UpdateActionGetData) =>
                formLoadedData.getActionGroupDistribution.revision.app_platform_revisions
                    .reduce((accumulator: PlatformAction[], currentValue) => {
                        return [
                            ...accumulator,
                            ...(currentValue.platform_revision
                                .platform_actions as PlatformAction[]),
                        ];
                    }, [])
                    .map((_) => ({
                        id: _.id,
                        platformDataMaps: _.platform_data_maps as PlatformDataMap[],
                    })),
            idValueForModelWithPlatformDataMaps: 'platformActionId',
            buildExistingModelData: (formLoadedData) => ({
                id: formLoadedData.getAction.platform_action.id,
                dataMaps: formLoadedData.getAction.data_maps as DataMap[],
            }),
        },
        ...props,
    };

    return (
        <DialogPreloadForm<UpdateActionGetData, ActionValues, ActionFormProps, UpdateActionResult>
            {...actionUpdateProps}
        />
    );
};

export default ActionUpdate;
