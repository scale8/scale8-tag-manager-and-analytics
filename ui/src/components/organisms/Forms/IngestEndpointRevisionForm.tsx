import { FC } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    IngestEndpointRevisionFormProps,
    IngestEndpointRevisionValues,
} from '../../../dialogPages/dataManager/IngestEndpointRevisionUpdate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';

const IngestEndpointRevisionForm: FC<IngestEndpointRevisionFormProps> = (
    props: IngestEndpointRevisionFormProps,
) => {
    return (
        <DialogFormContextProvider<IngestEndpointRevisionValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default IngestEndpointRevisionForm;
