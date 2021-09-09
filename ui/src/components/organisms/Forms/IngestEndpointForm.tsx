import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointFormProps } from '../../../dialogPages/dataManager/IngestEndpointCreate';

const IngestEndpointForm: FC<IngestEndpointFormProps> = (props: IngestEndpointFormProps) => {
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
        </DrawerFormLayout>
    );
};

export default IngestEndpointForm;
