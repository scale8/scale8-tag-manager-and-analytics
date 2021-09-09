import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import VariableScopeTable from '../ActionPermissionTables/VariableScopeTable';

const DataLayerActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Access data layer"
            subtitle="Accesses data from the dataLayer."
        >
            <VariableScopeTable {...props} />
        </ActionPermissionSection>
    );
};

export default DataLayerActionPermission;
