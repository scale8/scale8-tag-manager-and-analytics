import { FC } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import UpdateOrgUserGetQuery from '../../gql/queries/UpdateOrgUserGetQuery';
import { UpdateOrgUserGetData } from '../../gql/generated/UpdateOrgUserGetData';
import {
    permissionsCustomValueSetter,
    PermissionsFormProps,
    PermissionsValues,
} from '../../utils/PermissionsUtils';
import { FormValidationResult } from '../../hooks/form/useFormValidation';
import UpdateOrgUserQuery from '../../gql/mutations/UpdateOrgUserQuery';
import { UpdateOrgUser } from '../../gql/generated/UpdateOrgUser';
import OrgUserUpdateForm from '../../components/organisms/Forms/OrgUserUpdateForm';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogPreloadForm, DialogPreloadFormProps } from '../abstractions/DialogPreloadForm';

const OrgUserUpdate: FC<DialogPageProps> = (props: DialogPageProps) => {
    const orgId = props.contextId;
    const userId = props.id;

    const orgUserUpdateProps: DialogPreloadFormProps<
        UpdateOrgUserGetData,
        PermissionsValues,
        PermissionsFormProps,
        UpdateOrgUser
    > = {
        loadQuery: useQuery<UpdateOrgUserGetData>(UpdateOrgUserGetQuery, {
            variables: { orgId, userId },
        }),
        buildInitialStatePreload: (formLoadedData: UpdateOrgUserGetData) => ({
            permissionsCanView: formLoadedData.getOrgUserPermissions.can_view,
            permissionsCanCreate: formLoadedData.getOrgUserPermissions.can_create,
            permissionsCanEdit: formLoadedData.getOrgUserPermissions.can_edit,
            permissionsCanDelete: formLoadedData.getOrgUserPermissions.can_delete,
            permissionsIsAdmin: formLoadedData.getOrgUserPermissions.is_admin,
        }),
        saveQuery: useMutation<UpdateOrgUser>(UpdateOrgUserQuery),
        mapSaveData: (permissionsValues: PermissionsValues) => ({
            orgUpdateUserInput: {
                org_id: orgId,
                user_id: userId,
                permission_group: {
                    can_view: permissionsValues.permissionsCanView,
                    can_create: permissionsValues.permissionsCanCreate,
                    can_edit: permissionsValues.permissionsCanEdit,
                    can_delete: permissionsValues.permissionsCanDelete,
                    is_admin: permissionsValues.permissionsIsAdmin,
                },
            },
        }),
        buildFormProps: (
            formLoadedData: UpdateOrgUserGetData,
            formValidationValues: FormValidationResult<PermissionsValues>,
            gqlError?: ApolloError,
        ) => ({
            ...formValidationValues,
            gqlError,
            submitText: 'Change User Permissions',
            title: 'Change User Permissions',
            formInfoProps: buildStandardFormInfo('organizationUsers', 'Update'),
            handleDialogClose: props.handleDialogClose,
        }),
        checkSuccessfullySubmitted: (formMutationData) => !!formMutationData?.updateUserPermissions,
        pageComponent: OrgUserUpdateForm,
        validators: [],
        customValueSetter: permissionsCustomValueSetter,
        ...props,
    };

    return (
        <DialogPreloadForm<
            UpdateOrgUserGetData,
            PermissionsValues,
            PermissionsFormProps,
            UpdateOrgUser
        >
            {...orgUserUpdateProps}
        />
    );
};

export { OrgUserUpdate };
