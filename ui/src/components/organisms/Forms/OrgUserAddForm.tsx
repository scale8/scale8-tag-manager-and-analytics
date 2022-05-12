import { FC } from 'react';
import FormPermissionSection from '../../molecules/FormPermissionSection';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { OrgUserAddFormProps, OrgUserAddValues } from '../../../dialogPages/global/OrgUserAdd';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';

const OrgUserAddForm: FC<OrgUserAddFormProps> = (props: OrgUserAddFormProps) => {
    return (
        <DialogFormContextProvider<OrgUserAddValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="firstName" label="First Name" fullWidth />
                <DialogFormTextInput name="lastName" label="Last Name" fullWidth />
                <DialogFormTextInput name="email" label="Email" />
                <FormPermissionSection formProps={props} />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default OrgUserAddForm;
