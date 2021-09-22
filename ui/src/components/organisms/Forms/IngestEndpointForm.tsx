import { FC } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointFormProps } from '../../../dialogPages/dataManager/IngestEndpointCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';
import CheckBoxInput from '../../atoms/InputTypes/CheckBoxInput';
import { Mode } from '../../../gql/generated/globalTypes';
import { useConfigState } from '../../../context/AppContext';

const IngestEndpointForm: FC<IngestEndpointFormProps> = (props: IngestEndpointFormProps) => {
    const { mode } = useConfigState();

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
            {mode !== Mode.COMMERCIAL && (
                <>
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
                    <small className="DrawerFormField" style={{ marginTop: '-24px' }}>
                        Enable analytics dashboard when using Data Manager.
                    </small>
                    {props.values.analyticsEnabled && (
                        <StorageProviderSelector
                            {...props}
                            warnGraphDisabled
                            infoText="Your analytics will be sent to your chosen storage provider. MongoDB is a
                        great solution for very low traffic websites and doesn't require any
                        configuration unless you wish to specify your own MongoDB servers. We
                        strongly recommend using BigQuery or Clickhouse for larger websites."
                        />
                    )}
                </>
            )}
        </DrawerFormLayout>
    );
};

export default IngestEndpointForm;
