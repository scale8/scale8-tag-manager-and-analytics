import { FC } from 'react';
import FormPermissionSection from '../../molecules/FormPermissionSection';
import { PermissionsFormProps } from '../../../utils/PermissionsUtils';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';

const OrgUserUpdateForm: FC<PermissionsFormProps> = (props: PermissionsFormProps) => {
    return (
        <DrawerFormLayout {...props}>
            <FormPermissionSection formProps={props} />
        </DrawerFormLayout>
    );
};

export default OrgUserUpdateForm;
