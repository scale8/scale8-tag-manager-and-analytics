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
                label="Enable simple analytics dashboard when using Tag Manager. We recommend this option is left enabled."
                className="DrawerFormField"
                style={{ marginLeft: '-11px' }}
                color="primary"
            />
            {props.values.analyticsEnabled && (
                <>
                    {props.isCreate && (
                        <small className="DrawerFormField">
                            Your analytics and error data will be sent to your chosen storage
                            provider. MongoDB is a great solution for very low traffic websites and
                            doesn't require any configuration unless you wish to specify your own
                            MongoDB servers. We strongly recommend using BigQuery or Clickhouse for
                            larger websites.
                        </small>
                    )}
                    <StorageProviderSelector {...props} warnGraphDisabled />
                </>
            )}
        </DrawerFormLayout>
    );
};

export default IngestEndpointForm;
