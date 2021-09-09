import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import UrlPartsTable from '../ActionPermissionTables/UrlPartsTable';

const ReadPageUrlActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Reads Page URL"
            subtitle="Returns part or all of the URL of the current page."
        >
            <UrlPartsTable {...props} />
        </ActionPermissionSection>
    );
};

export default ReadPageUrlActionPermission;
