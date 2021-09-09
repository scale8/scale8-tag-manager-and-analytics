import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import EventNameTable from '../ActionPermissionTables/EventNameTable';

const EmitEventActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Emit Event"
            subtitle="Allows to emit an event. The event name must be present in the following list."
        >
            <EventNameTable {...props} />
        </ActionPermissionSection>
    );
};

export default EmitEventActionPermission;
