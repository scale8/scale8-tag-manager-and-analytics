import { FC } from 'react';
import { UpdateActionPermissionProps } from '../ActionPermissions/ActionPermissionSection';
import { ActionPermissionTable } from './ActionPermissionTable';

const VariableScopeTable: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    const permissionElementKey = 'variableReadWriteExecuteScopes';
    const emptyError = 'Cannot set an empty Name.';
    const duplicateError = 'Name already set.';
    const title = 'Keys';
    const submitText = 'Add Key';

    return (
        <ActionPermissionTable
            permissionElementKey={permissionElementKey}
            emptyError={emptyError}
            duplicateError={duplicateError}
            title={title}
            submitText={submitText}
            {...props}
        />
    );
};

export default VariableScopeTable;
