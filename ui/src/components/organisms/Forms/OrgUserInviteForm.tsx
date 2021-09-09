import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormPermissionSection from '../../molecules/FormPermissionSection';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { OrgUserInviteFormProps } from '../../../dialogPages/global/OrgUserInvite';

const OrgUserInviteForm: FC<OrgUserInviteFormProps> = (props: OrgUserInviteFormProps) => {
    return (
        <DrawerFormLayout {...props}>
            <ControlledTextInput
                name="email"
                label="Email"
                formProps={props}
                className="DrawerFormField"
                required
                autoFocus
            />
            <FormPermissionSection formProps={props} />
        </DrawerFormLayout>
    );
};

export default OrgUserInviteForm;
