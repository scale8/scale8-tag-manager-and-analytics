import { FC } from 'react';
import { UpdateActionPermissionProps } from '../ActionPermissions/ActionPermissionSection';
import { ActionPermissionTable } from './ActionPermissionTable';

const HostMatchesTable: FC<UpdateActionPermissionProps> = (props: UpdateActionPermissionProps) => {
    const permissionElementKey = 'hostMatches';
    const emptyError = 'Cannot set an empty Host.';
    const duplicateError = 'Host already set.';
    const title = 'Hosts';
    const submitText = 'Add Host';

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

export default HostMatchesTable;
