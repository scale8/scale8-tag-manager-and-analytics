import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import HostMatchesTable from '../ActionPermissionTables/HostMatchesTable';

const InjectJsActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection title="Injects scripts" subtitle="Injects a script into the page.">
            <HostMatchesTable {...props} />
        </ActionPermissionSection>
    );
};

export default InjectJsActionPermission;
