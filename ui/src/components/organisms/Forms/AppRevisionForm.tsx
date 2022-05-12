import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import { AppRevisionFormProps } from '../../../dialogPages/tagManager/app/AppRevisionUpdate';

const AppRevisionForm: FC<AppRevisionFormProps> = (props: AppRevisionFormProps) => {
    return (
        <DrawerFormLayout {...props}>
            <ControlledTextInput
                name="name"
                label="Name"
                formProps={props}
                className="DialogFormField"
                required
                autoFocus
            />
            <ControlledTextAreaInput
                name="comments"
                label="Comments"
                formProps={props}
                className="DialogFormField"
            />
        </DrawerFormLayout>
    );
};

export default AppRevisionForm;
