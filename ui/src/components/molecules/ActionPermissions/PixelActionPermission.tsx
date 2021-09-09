import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import HostMatchesTable from '../ActionPermissionTables/HostMatchesTable';

const PixelActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Sends pixels"
            subtitle="Sends a GET request to a specified Host. Response isn't processed."
        >
            <HostMatchesTable {...props} />
        </ActionPermissionSection>
    );
};

export default PixelActionPermission;
