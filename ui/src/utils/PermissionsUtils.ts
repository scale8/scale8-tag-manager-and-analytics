import { FormProps, FormValues } from '../hooks/form/useFormValidation';
import { Dispatch, SetStateAction } from 'react';
import { OrgUserPageData_getOrg_users_permissions } from '../gql/generated/OrgUserPageData';

export type PermissionsValues = {
    permissionsCanView: boolean;
    permissionsCanCreate: boolean;
    permissionsCanEdit: boolean;
    permissionsCanDelete: boolean;
    permissionsIsAdmin: boolean;
};

export type PermissionsFormProps = FormProps<PermissionsValues>;

const permissionsInitialState = {
    permissionsCanView: true,
    permissionsCanCreate: false,
    permissionsCanEdit: false,
    permissionsCanDelete: false,
    permissionsIsAdmin: false,
};

const permissionsCustomValueSetter = <T extends FormValues>(
    valueKey: string,
    value: unknown,
    values: T,
    setValues: Dispatch<SetStateAction<T>>,
): void => {
    if (valueKey === 'permissionsIsAdmin') {
        setValues({
            ...values,
            [valueKey]: value as boolean,
            permissionsCanView: true,
            permissionsCanCreate: true,
            permissionsCanEdit: true,
            permissionsCanDelete: true,
        });
    } else if (
        valueKey === 'permissionsCanCreate' ||
        valueKey === 'permissionsCanEdit' ||
        valueKey === 'permissionsCanDelete'
    ) {
        setValues({
            ...values,
            [valueKey]: value as boolean,
            permissionsCanView: true,
        });
    } else {
        setValues({
            ...values,
            [valueKey]: value,
        });
    }
};

const buildPermissionString = (permissions: OrgUserPageData_getOrg_users_permissions): string => {
    if (permissions.is_admin) {
        return 'Admin';
    }
    const permissionsStringArray = [];

    if (
        permissions.can_view &&
        !(permissions.can_create || permissions.can_edit || permissions.can_delete)
    ) {
        permissionsStringArray.push('View Only');
    }
    if (permissions.can_create) {
        permissionsStringArray.push('Create');
    }
    if (permissions.can_edit) {
        permissionsStringArray.push('Edit');
    }
    if (permissions.can_delete) {
        permissionsStringArray.push('Delete');
    }
    if (permissionsStringArray.length === 0) {
        return 'None';
    }
    if (permissionsStringArray.length === 3) {
        return 'All';
    }
    return permissionsStringArray.join(' / ');
};

export { permissionsInitialState, permissionsCustomValueSetter, buildPermissionString };
