import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import VariableScopeTable from '../ActionPermissionTables/VariableScopeTable';

const CookieActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Access cookie values"
            subtitle="Accesses the values of the cookies with the specified name."
        >
            <VariableScopeTable {...props} />
        </ActionPermissionSection>
    );
};

export default CookieActionPermission;
