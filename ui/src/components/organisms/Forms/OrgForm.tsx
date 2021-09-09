import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { OrgFormProps } from '../../../dialogPages/global/OrgCreate';

const OrgForm: FC<OrgFormProps> = (props: OrgFormProps) => {
    return (
        <DrawerFormLayout {...props}>
            <ControlledTextInput
                name="name"
                label="Name"
                formProps={props}
                className="DrawerFormField"
                required
                autoFocus
            />
        </DrawerFormLayout>
    );
};

export default OrgForm;
