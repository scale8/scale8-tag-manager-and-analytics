import { FC } from 'react';
import { UpdateActionPermissionProps } from '../ActionPermissions/ActionPermissionSection';
import { ActionPermissionTable } from './ActionPermissionTable';

const EventNameTable: FC<UpdateActionPermissionProps> = (props: UpdateActionPermissionProps) => {
    const permissionElementKey = 'eventNames';
    const emptyError = 'Cannot set an empty Name.';
    const duplicateError = 'Name already set.';
    const title = 'Event Names';
    const submitText = 'Add Event Name';

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

export default EventNameTable;
