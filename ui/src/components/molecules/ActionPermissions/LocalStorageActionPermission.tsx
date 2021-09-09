import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import VariableScopeTable from '../ActionPermissionTables/VariableScopeTable';

const LocalStorageActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Access local storage"
            subtitle="Accesses data stored in local storage."
        >
            <VariableScopeTable {...props} />
        </ActionPermissionSection>
    );
};

export default LocalStorageActionPermission;
