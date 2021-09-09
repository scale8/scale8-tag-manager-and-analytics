import { FC } from 'react';
import ActionPermissionSection from './ActionPermissionSection';

const LogToConsoleActionPermission: FC = () => {
    return (
        <ActionPermissionSection
            title="Logs to console"
            subtitle="Logs to the developer console."
        />
    );
};

export default LogToConsoleActionPermission;
