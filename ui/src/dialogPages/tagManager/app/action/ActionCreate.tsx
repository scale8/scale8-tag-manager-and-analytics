import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import CreateActionQuery from '../../../../gql/mutations/CreateActionQuery';
import ActionForm from '../../../../components/organisms/Forms/ActionForm';
import FetchAvailablePlatformActionsQuery from '../../../../gql/queries/FetchAvailablePlatformActionsQuery';
import { FetchAvailablePlatformActions } from '../../../../gql/generated/FetchAvailablePlatformActions';
import { FormWithMappedPlatformValuesResult } from '../../../../hooks/form/useFormWithMappedPlatformValues';
import nameValidator from '../../../../utils/validators/nameValidator';
import { MappedPlatformValues } from '../../../../types/MappedPlatformValuesTypes';
import { ActionCreateInput, DataMapInput } from '../../../../gql/generated/globalTypes';
import { mappedPlatformValuesToDataMapInput } from '../../../../utils/MappedPlatformValuesUtils';
import { CreateActionResult } from '../../../../gql/generated/CreateActionResult';
import { PlatformDataMap } from '../../../../types/DataMapsTypes';
import { AppPlatformRevision, PlatformAction } from '../../../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../../../types/IngestEndpointsTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { ActionFormProps, ActionValues } from '../../../../types/props/forms/ActionFormProps';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../../abstractions/DialogPreloadForm';
import { getActionIcon } from '../../../../utils/TypeIconsUtils';
import { useConfigState } from '../../../../context/AppContext';

const buildActionCreateInput = (
    actionName: string,
    actionGroupId: string,
    platformActionId: string,
    mappedPlatformValues: MappedPlatformValues,
    comments: string,
): ActionCreateInput => {
    const data_maps: DataMapInput[] = mappedPlatformValuesToDataMapInput(mappedPlatformValues);

    return {
        action_group_id: actionGroupId,
        platform_action_id: platformActionId,
        name: actionName,
        data_maps,
        ...(comments === '' ? {} : { comments }),
    };
};

const ActionCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { consentPurposes, consentVendors } = useConfigState();

    const actionCreateProps: DialogPreloadFormProps<
        FetchAvailablePlatformActions,
        ActionValues,
        ActionFormProps,
        CreateActionResult
    > = {
        loadQuery: useQuery<FetchAvailablePlatformActions>(FetchAvailablePlatformActionsQuery, {
            variables: { id: props.contextId },
        }),
        buildInitialStatePreload: () => ({
            name: '',
            platformActionId: '',
            comments: '',
        }),
        saveQuery: useMutation(CreateActionQuery),
        mapSaveData: (actionValues: ActionValues) => {
            const actionCreateInput = buildActionCreateInput(
                actionValues.name,
                props.id,
                actionValues.platformActionId,
                actionValues.mappedPlatformValues ?? [],
                actionValues.comments,
            );
            return { actionCreateInput };
        },
        buildFormProps: (
            formLoadedData: FetchAvailablePlatformActions,
            formValidationValues: FormWithMappedPlatformValuesResult<ActionValues>,
            gqlError?: ApolloError,
        ): ActionFormProps => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Add Action',
            title: 'Add Action',
            formInfoProps: buildStandardFormInfo('actions', 'Create'),
            handleDialogClose: props.handleDialogClose,
            appPlatformRevisions: formLoadedData.getActionGroupDistribution.revision
                .app_platform_revisions as AppPlatformRevision[],
            environments: formLoadedData.getActionGroupDistribution.revision.app.environments,
            revisions: formLoadedData.getActionGroupDistribution.revision.app.revisions,
            consentPurposes,
            consentVendors,
            ingestEndpoints:
                formLoadedData.getActionGroupDistribution.revision.app.tag_manager_account.org
                    .data_manager_account === null
                    ? []
                    : (formLoadedData.getActionGroupDistribution.revision.app.tag_manager_account
                          .org.data_manager_account
                          .ingest_endpoints as IngestEndpointForEnvironmentSelection[]),
            platformActions:
                formLoadedData.getActionGroupDistribution.revision.app_platform_revisions.map(
                    (_) => ({
                        key: _.platform_revision.platform.id,
                        text: _.platform_revision.platform.name,
                        sub: _.platform_revision.platform_actions.map((a) => {
                            const Icon = getActionIcon(a.icon);

                            return {
                                key: a.id,
                                text: a.name,
                                iconType: a.icon,
                                icon: <Icon />,
                                description: a.description,
                            };
                        }),
                    }),
                ),
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createAction.id !== undefined,
        pageComponent: ActionForm,
        validators: [
            {
                field: 'name',
                validator: nameValidator,
                error: () => 'Action name too short',
            },
        ],
        mappedPlatformValuesProps: {
            buildAvailableModelsWithPlatformDataMaps: (
                formLoadedData: FetchAvailablePlatformActions,
            ) =>
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
        },
        ...props,
    };

    return (
        <DialogPreloadForm<
            FetchAvailablePlatformActions,
            ActionValues,
            ActionFormProps,
            CreateActionResult
        >
            {...actionCreateProps}
        />
    );
};

export { ActionCreate, buildActionCreateInput };
