import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    ActionGroupFormProps,
    ActionGroupValues,
} from '../../../dialogPages/tagManager/app/action/ActionGroupCreate';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';

const ActionGroupForm: FC<ActionGroupFormProps> = (props: ActionGroupFormProps) => {
    return (
        <DialogFormContextProvider<ActionGroupValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default ActionGroupForm;
