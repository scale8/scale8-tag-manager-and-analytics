import { FC } from 'react';
import FormPermissionSection from '../../molecules/FormPermissionSection';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    OrgUserInviteFormProps,
    OrgUserInviteValues,
} from '../../../dialogPages/global/OrgUserInvite';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const OrgUserInviteForm: FC<OrgUserInviteFormProps> = (props: OrgUserInviteFormProps) => {
    return (
        <DialogFormContextProvider<OrgUserInviteValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="email" label="Email" autoFocus />
                <FormPermissionSection formProps={props} />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default OrgUserInviteForm;
