import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { ActionGroupFormProps } from '../../../dialogPages/tagManager/app/action/ActionGroupCreate';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';

const ActionGroupForm: FC<ActionGroupFormProps> = (props: ActionGroupFormProps) => {
    return (
        <DrawerFormLayout {...props}>
            <DialogFormTextInput name="name" label="Name" autoFocus />
            <DialogFormTextAreaInput name="comments" label="Comments" optional />
        </DrawerFormLayout>
    );
};

export default ActionGroupForm;
