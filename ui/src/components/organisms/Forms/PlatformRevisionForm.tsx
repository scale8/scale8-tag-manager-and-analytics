import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import { PlatformRevisionFormProps } from '../../../dialogPages/tagManager/platform/PlatformRevisionUpdate';

const PlatformRevisionForm: FC<PlatformRevisionFormProps> = (props: PlatformRevisionFormProps) => {
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
            <ControlledTextAreaInput
                name="comments"
                label="Comments"
                formProps={props}
                className="DrawerFormField"
            />
        </DrawerFormLayout>
    );
};

export default PlatformRevisionForm;
