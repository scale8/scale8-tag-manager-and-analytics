import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    PlatformRevisionFormProps,
    PlatformRevisionValues,
} from '../../../dialogPages/tagManager/platform/PlatformRevisionUpdate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';

const PlatformRevisionForm: FC<PlatformRevisionFormProps> = (props: PlatformRevisionFormProps) => {
    return (
        <DialogFormContextProvider<PlatformRevisionValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default PlatformRevisionForm;
