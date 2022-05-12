import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointRevisionFormProps } from '../../../dialogPages/dataManager/IngestEndpointRevisionUpdate';

const IngestEndpointRevisionForm: FC<IngestEndpointRevisionFormProps> = (
    props: IngestEndpointRevisionFormProps,
) => {
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
        </DrawerFormLayout>
    );
};

export default IngestEndpointRevisionForm;
