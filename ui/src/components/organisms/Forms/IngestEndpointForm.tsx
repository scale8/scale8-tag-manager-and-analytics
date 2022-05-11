import { FC, useEffect, useState } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { IngestEndpointFormProps } from '../../../dialogPages/dataManager/IngestEndpointCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';
import { IngestSchemaWizard, Mode } from '../../../gql/generated/globalTypes';
import { useConfigState } from '../../../context/AppContext';
import { Checkbox, FormControlLabel } from '@mui/material';
import { snakeToTitleCase } from '../../../utils/TextUtils';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { IngestEndpointValues } from '../../../utils/forms/IngestEndpointFormUtils';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';
import { DialogFormCheckbox } from '../../atoms/DialogFormInputs/DialogFormCheckbox';
import { DialogPlainAlert } from '../../atoms/DialogFormInputs/DialogPlainAlert';

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
        <DialogFormContextProvider<IngestEndpointValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <DialogFormTextInput name="name" label="Name" autoFocus />
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
                    <DialogFormSelect
                        label="Wizard"
                        name="wizard"
                        values={Object.values(IngestSchemaWizard).map((_) => ({
                            key: _,
                            text: snakeToTitleCase(_),
                        }))}
                    />
                )}
                {mode !== Mode.COMMERCIAL && (
                    <>
                        <DialogFormCheckbox
                            name="analyticsEnabled"
                            label="Enable Analytics"
                            realignLeft
                        />
                        <DialogPlainAlert realignTop>
                            Enable analytics dashboard when using Data Manager.
                        </DialogPlainAlert>
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
        </DialogFormContextProvider>
    );
};

export default IngestEndpointForm;
