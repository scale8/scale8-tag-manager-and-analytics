import { Dispatch, FC, SetStateAction } from 'react';
import { FormValidationResult } from '../../../hooks/form/useFormValidation';
import { ApolloError, useMutation } from '@apollo/client';
import { DialogPageProps } from '../../../types/DialogTypes';
import { buildStandardFormInfo } from '../../../utils/InfoLabelsUtils';
import SimpleMessage from '../../../components/molecules/SimpleMessage';
import TemplatedActionForm from '../../../components/organisms/Forms/TemplatedActionForm';
import { TemplatedActionFormProps } from '../../../types/props/forms/TemplatedActionFormProps';
import { CreateTemplatedActionResult } from '../../../gql/generated/CreateTemplatedActionResult';
import CreateTemplatedActionQuery from '../../../gql/mutations/CreateTemplatedActionQuery';
import { getPlatformDataMapInputType } from '../../../utils/PlatformDataMapTypeUtils';
import { PlatformActionTemplatedDataMapCreateInput } from '../../../gql/generated/globalTypes';
import { PlatformDataMapInput } from '../../../types/DataMapsTypes';
import {
    TemplatedActionsValues,
    TemplatedActionValidators,
} from '../../../utils/forms/TemplatedActionFormUtils';
import { DialogForm, DialogFormProps } from '../../abstractions/DialogForm';
import { actionPermissionsFromCode } from '../../../utils/ActionPermissionsUtils';
import { useLoggedInState } from '../../../context/AppContext';

const convertPlatformDataMapsForInput = (
    dataMapInputs: PlatformDataMapInput[],
): PlatformActionTemplatedDataMapCreateInput[] => {
    return dataMapInputs.map((input: PlatformDataMapInput) => ({
        key: input.key,
        description: input.description,
        input_type: getPlatformDataMapInputType(input.type),
        default_value: input.default_value,
        default_values: input.default_values,
        option_values: input.option_values,
        validation_rules: input.validation_rules,
        child_platform_data_maps: convertPlatformDataMapsForInput(input.child_platform_data_maps),
        optional: input.optional,
    }));
};

const TemplatedActionCreate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const revisionId = props.contextId;
    const { loggedInUserState } = useLoggedInState();
    const { userIsAdmin } = loggedInUserState;

    const initialCode =
        '/*\n    See documentation @ https://docs.scale8.com\n*/\n\n// notify Scale8 Tag Manager that the. action is complete.\nsuccess();';

    const templatedActionCreateProps: DialogFormProps<
        TemplatedActionsValues,
        TemplatedActionFormProps,
        CreateTemplatedActionResult
    > = {
        buildInitialState: () => ({
            name: '',
            description: '',
            icon: '',
            execRaw: false,
            code: initialCode,
            platformDataMaps: [],
            permissionRequests: [],
        }),
        saveQuery: useMutation(CreateTemplatedActionQuery),
        mapSaveData: (templatedActionsValues: TemplatedActionsValues) => ({
            platformActionTemplatedCreateInput: {
                platform_revision_id: revisionId,
                name: templatedActionsValues.name,
                description: templatedActionsValues.description,
                icon: templatedActionsValues.icon,
                code: templatedActionsValues.code,
                exec_raw_in_iframe: templatedActionsValues.execRaw,
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
            formValidationValues: FormValidationResult<TemplatedActionsValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            title: 'Create Templated Action',
            formInfoProps: buildStandardFormInfo('platforms', 'Create'),
            handleDialogClose: props.handleDialogClose,
            readOnly: false,
            isEdit: false,
            userIsAdmin,
        }),
        checkSuccessfullySubmitted: (formMutationData) =>
            formMutationData?.createTemplatedAction.id !== undefined,
        pageComponent: TemplatedActionForm,
        validators: TemplatedActionValidators,
        customValueSetter: (
            valueKey: string,
            value: any,
            values: TemplatedActionsValues,
            setValues: Dispatch<SetStateAction<TemplatedActionsValues>>,
        ) => {
            if (valueKey === 'execRaw') {
                setValues({
                    ...values,
                    [valueKey]: value,
                    permissionRequests: actionPermissionsFromCode(
                        !value,
                        values['code'],
                        values['permissionRequests'],
                    ),
                });
            } else {
                setValues({
                    ...values,
                    [valueKey]: value,
                });
            }
        },
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
        <DialogForm<TemplatedActionsValues, TemplatedActionFormProps, CreateTemplatedActionResult>
            {...templatedActionCreateProps}
        />
    );
};

export { TemplatedActionCreate, convertPlatformDataMapsForInput };
