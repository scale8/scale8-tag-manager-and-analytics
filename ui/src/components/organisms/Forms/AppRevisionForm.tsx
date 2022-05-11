import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    AppRevisionFormProps,
    AppRevisionValues,
} from '../../../dialogPages/tagManager/app/AppRevisionUpdate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';

const AppRevisionForm: FC<AppRevisionFormProps> = (props: AppRevisionFormProps) => {
    return (
        <DialogFormContextProvider<AppRevisionValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default AppRevisionForm;
