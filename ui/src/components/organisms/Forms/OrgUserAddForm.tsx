import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormPermissionSection from '../../molecules/FormPermissionSection';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { OrgUserAddFormProps } from '../../../dialogPages/global/OrgUserAdd';

const OrgUserAddForm: FC<OrgUserAddFormProps> = (props: OrgUserAddFormProps) => {
    return (
        <DrawerFormLayout {...props}>
            <ControlledTextInput
                name="firstName"
                label="First Name"
                formProps={props}
                className="DialogFormField"
                required
                fullWidth
            />
            <ControlledTextInput
                name="lastName"
                label="Last Name"
                formProps={props}
                className="DialogFormField"
                required
                fullWidth
            />
            <ControlledTextInput
                name="email"
                label="Email"
                formProps={props}
                className="DialogFormField"
                required
            />
            <FormPermissionSection formProps={props} />
        </DrawerFormLayout>
    );
};

export default OrgUserAddForm;
