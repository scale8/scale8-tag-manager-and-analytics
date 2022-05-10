import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import { RuleGroupFormProps } from '../../../dialogPages/tagManager/app/tag/RuleGroupCreate';

const RuleGroupForm: FC<RuleGroupFormProps> = (props: RuleGroupFormProps) => {
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

export default RuleGroupForm;
