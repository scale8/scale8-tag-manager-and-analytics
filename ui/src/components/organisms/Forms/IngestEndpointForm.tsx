import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointFormProps } from '../../../dialogPages/dataManager/IngestEndpointCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';
import CheckBoxInput from '../../atoms/InputTypes/CheckBoxInput';

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
            <CheckBoxInput
                name="analyticsEnabled"
                value={props.values.analyticsEnabled}
                setValue={(v) => {
                    props.handleChange('analyticsEnabled', v);
                }}
                label="Enable Analytics"
                className="DrawerFormField"
                style={{ marginLeft: '-11px' }}
                color="primary"
            />
            <StorageProviderSelector {...props} warnGraphDisabled />
        </DrawerFormLayout>
    );
};

export default IngestEndpointForm;
