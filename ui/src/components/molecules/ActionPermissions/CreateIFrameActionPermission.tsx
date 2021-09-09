import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import HostMatchesTable from '../ActionPermissionTables/HostMatchesTable';

const CreateIFrameActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection title="Injects iframe" subtitle="Injects an iframe.">
            <HostMatchesTable {...props} />
        </ActionPermissionSection>
    );
};

export default CreateIFrameActionPermission;
