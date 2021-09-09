import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import VariableScopeTable from '../ActionPermissionTables/VariableScopeTable';

const GlobalVariableActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Access to global variables"
            subtitle="Accesses global variables (potentially including sensitive APIs)."
        >
            <VariableScopeTable {...props} />
        </ActionPermissionSection>
    );
};

export default GlobalVariableActionPermission;
