import { FC } from 'react';
import ActionPermissionSection, { UpdateActionPermissionProps } from './ActionPermissionSection';
import UrlPartsTable from '../ActionPermissionTables/UrlPartsTable';

const ReadReferrerUrlActionPermission: FC<UpdateActionPermissionProps> = (
    props: UpdateActionPermissionProps,
) => {
    return (
        <ActionPermissionSection
            title="Reads Referrer URL"
            subtitle="Returns part or all of the URL of the current page referrer."
        >
            <UrlPartsTable {...props} />
        </ActionPermissionSection>
    );
};

export default ReadReferrerUrlActionPermission;
