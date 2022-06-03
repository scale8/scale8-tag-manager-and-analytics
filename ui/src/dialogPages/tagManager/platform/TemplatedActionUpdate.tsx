import { FC } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { DialogPageProps } from '../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import SimpleMessage from '../../../components/molecules/SimpleMessage';
import TemplatedActionForm from '../../../components/organisms/Forms/TemplatedActionForm';
import { TemplatedActionFormProps } from '../../../types/props/forms/TemplatedActionFormProps';
import { convertPlatformDataMapsForInput } from './TemplatedActionCreate';
import { DialogPreloadForm, DialogPreloadFormProps } from '../../abstractions/DialogPreloadForm';
import { UpdateTemplatedActionGetData } from '../../../gql/generated/UpdateTemplatedActionGetData';
import UpdateTemplatedActionGetQuery from '../../../gql/queries/UpdateTemplatedActionGetQuery';
import { UpdateTemplatedActionResult } from '../../../gql/generated/UpdateTemplatedActionResult';
import UpdateTemplatedActionQuery from '../../../gql/mutations/UpdateTemplatedActionQuery';
import { PlatformDataMap, PlatformDataMapInput } from '../../../types/DataMapsTypes';
import { getTypeFromVarAndInput } from '../../../utils/PlatformDataMapTypeUtils';
import {
    extractDataMapDefaultValue,
    extractDataMapDefaultValues,
} from '../../../utils/MappedPlatformElementUtils';
import {
    TemplatedActionsValues,
    TemplatedActionValidators,
} from '../../../utils/forms/TemplatedActionFormUtils';
import { useLoggedInState } from '../../../context/AppContext';

const convertPlatformDataMapsForEdit = (dataMaps: PlatformDataMap[]): PlatformDataMapInput[] => {
    return dataMaps.map((dataMap: PlatformDataMap) => {
        const defaultValue = extractDataMapDefaultValue(dataMap);
        const defaultValues = extractDataMapDefaultValues(dataMap);

        return {
            key: dataMap.key,
            description: dataMap.description,
            type: getTypeFromVarAndInput(dataMap.var_type, dataMap.input_type),
            default_value: defaultValue ?? undefined,
            default_values: defaultValues ?? undefined,
            option_values: dataMap.option_values ?? undefined,
            validation_rules: dataMap.validation_rules ?? undefined,
            child_platform_data_maps: convertPlatformDataMapsForEdit(
                dataMap.child_platform_data_maps ?? [],
            ),
            optional: dataMap.is_optional,
        };
    });
};

const TemplatedActionUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { loggedInUserState } = useLoggedInState();
    const { userIsAdmin } = loggedInUserState;

    const templatedActionUpdateProps: DialogPreloadFormProps<
        UpdateTemplatedActionGetData,
        TemplatedActionsValues,
        TemplatedActionFormProps,
        UpdateTemplatedActionResult
    > = {
        loadQuery: useQuery<UpdateTemplatedActionGetData>(UpdateTemplatedActionGetQuery, {
            variables: { id: props.id },
        }),
        buildInitialStatePreload: (
            formLoadedData: UpdateTemplatedActionGetData,
        ): TemplatedActionsValues => ({
            name: formLoadedData.getPlatformAction.name,
            description: formLoadedData.getPlatformAction.description,
            code: formLoadedData.getPlatformAction.code ?? '',
            icon: formLoadedData.getPlatformAction.icon ?? '',
            execRaw: formLoadedData.getPlatformAction.exec_raw_in_iframe ?? false,
            platformDataMaps: convertPlatformDataMapsForEdit(
                formLoadedData.getPlatformAction.platform_data_maps as PlatformDataMap[],
            ),
            permissionRequests: formLoadedData.getPlatformAction.permissions_requests.map((_) => ({
                permission: _.permission,
                variableReadWriteExecuteScopes:
                    _.variable_read_write_execute_scopes === null
                        ? undefined
                        : _.variable_read_write_execute_scopes.map((_) => ({
                              name: _.name,
                              read: _.read,
                              write: _.write,
                              execute: _.execute,
                          })),
                urlParts: _.url_parts ?? undefined,
                hostMatches: _.host_matches ?? undefined,
                eventNames: _.event_names ?? undefined,
                active: true,
            })),
        }),
        saveQuery: useMutation(UpdateTemplatedActionQuery),
        mapSaveData: (templatedActionsValues: TemplatedActionsValues) => ({
            platformActionTemplatedUpdateInput: {
                platform_action_id: props.id,
                name: templatedActionsValues.name,
                description: templatedActionsValues.description,
                code: templatedActionsValues.code,
                icon: templatedActionsValues.icon,
                platform_data_maps: convertPlatformDataMapsForInput(
                    templatedActionsValues.platformDataMaps,
                ),
                permission_requests: templatedActionsValues.permissionRequests
                    .filter((_) => _.active)
                    .map((_) => ({
                        permission: _.permission,
                        variable_read_write_execute_scopes: _.variableReadWriteExecuteScopes,
                        url_parts: _.urlParts,
                        host_matches: _.hostMatches,
                        event_names: _.eventNames,
                    })),
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateTemplatedActionGetData,
            formValidationValues: FormValidationResult<TemplatedActionsValues>,
            gqlError?: ApolloError,
        ): TemplatedActionFormProps => ({
            ...formValidationValues,
            gqlError,
            title: props.readOnly ? 'Inspect Templated Action' : 'Update Templated Action',
            formInfoProps: buildStandardFormInfo('platforms', 'Update'),
            handleDialogClose: props.handleDialogClose,
            readOnly: props.readOnly,
            isEdit: true,
            userIsAdmin,
        }),
        checkSuccessfullySubmitted: (formMutationData) => formMutationData?.updateTemplatedAction,
        pageComponent: TemplatedActionForm,
        validators: TemplatedActionValidators,
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
        <DialogPreloadForm<
            UpdateTemplatedActionGetData,
            TemplatedActionsValues,
            TemplatedActionFormProps,
            UpdateTemplatedActionResult
        >
            {...templatedActionUpdateProps}
        />
    );
};

export default TemplatedActionUpdate;
