import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    RuleGroupFormProps,
    RuleGroupValues,
} from '../../../dialogPages/tagManager/app/tag/RuleGroupCreate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const RuleGroupForm: FC<RuleGroupFormProps> = (props: RuleGroupFormProps) => {
    return (
        <DialogFormContextProvider<RuleGroupValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default RuleGroupForm;
