import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    TriggerFormProps,
    TriggerValues,
} from '../../../dialogPages/tagManager/app/trigger/GlobalTriggerCreate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';

const GlobalTriggerForm: FC<TriggerFormProps> = (props: TriggerFormProps) => {
    return (
        <DialogFormContextProvider<TriggerValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default GlobalTriggerForm;
