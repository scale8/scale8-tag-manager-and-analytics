import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { OrgFormProps, OrgValues } from '../../../dialogPages/global/OrgCreate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const OrgForm: FC<OrgFormProps> = (props: OrgFormProps) => {
    return (
        <DialogFormContextProvider<OrgValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default OrgForm;
