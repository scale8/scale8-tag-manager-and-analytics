import { FC, useEffect, useState } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointFormProps } from '../../../dialogPages/dataManager/IngestEndpointCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';
import CheckBoxInput from '../../atoms/InputTypes/CheckBoxInput';
import { IngestSchemaWizard, Mode } from '../../../gql/generated/globalTypes';
import { useConfigState } from '../../../context/AppContext';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { snakeToTitleCase } from '../../../utils/TextUtils';

const IngestEndpointForm: FC<IngestEndpointFormProps> = (props: IngestEndpointFormProps) => {
    const { mode } = useConfigState();

    const [useWizard, setUseWizard] = useState(false);

    const { values, handleChange } = props;

    useEffect(() => {
        if (values.wizard !== '' && !useWizard) {
            handleChange('wizard', '');
        }
    }, [values, handleChange, useWizard]);

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
            {props.isCreate && (
                <FormControlLabel
                    sx={{ marginBottom: (theme) => theme.spacing(3) }}
                    control={
                        <Checkbox
                            name="useWizard"
                            checked={useWizard}
                            onChange={(event) => {
                                setUseWizard(event.target.checked);
                            }}
                            color="primary"
                        />
                    }
                    label="Use Wizard"
                />
            )}
            {useWizard && (
                <ControlledSelect
                    className="DialogFormField"
                    label="Wizard"
                    name="wizard"
                    values={Object.values(IngestSchemaWizard).map((_) => ({
                        key: _,
                        text: snakeToTitleCase(_),
                    }))}
                    formProps={props}
                    required
                />
            )}
            {mode !== Mode.COMMERCIAL && (
                <>
                    <CheckBoxInput
                        name="analyticsEnabled"
                        value={props.values.analyticsEnabled}
                        setValue={(v) => {
                            props.handleChange('analyticsEnabled', v);
                        }}
                        label="Enable Analytics"
                        className="DialogFormField"
                        sx={{ marginLeft: '-11px!important' }}
                        color="primary"
                    />
                    <Box component="small" className="DialogFormField" sx={{ marginTop: '-24px' }}>
                        Enable analytics dashboard when using Data Manager.
                    </Box>
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
