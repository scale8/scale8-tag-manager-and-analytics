import { FC, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';
import { controlledSelectValuesFindByInnerKey } from '../../../utils/ControlledSelectUtils';
import { MappedPlatformValuesForm } from '../../molecules/MappedPlatformValues/MappedPlatformValuesForm';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    EventFormProps,
    EventValues,
} from '../../../dialogPages/tagManager/app/trigger/EventCreate';
import { buildEventName } from '../../../dialogPages/tagManager/app/trigger/EventUpdate';
import { Box } from '@mui/system';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormIntegerInput } from '../../atoms/DialogFormInputs/DialogFormIntegerInput';
import { DialogFormFilteredSelects } from '../../atoms/DialogFormInputs/DialogFormFilteredSelects';

const getDescription = (values: EventValues, availableEvents: SelectValueWithSub[]): string => {
    if (!values.eventId) {
        return '';
    }

    const selectedEvent = controlledSelectValuesFindByInnerKey(availableEvents, values.eventId);

    return selectedEvent?.description ?? '';
};

const EventForm: FC<EventFormProps> = (props: EventFormProps) => {
    const notAvailable = props.availableEvents.length < 1;

    const [useCustom, setUseCustom] = useState(!!props.useCustom);
    const [generateName, setGenerateName] = useState(
        props.generateName === undefined ? true : props.generateName,
    );
    const [useEventAsName, setUseEventAsName] = useState(
        props.useEventAsName === undefined ? true : props.useEventAsName,
    );

    const { values, availableEvents, handleChange } = props;

    useEffect(() => {
        if (useCustom) {
            const currentName = values.browserEvent;

            if (useEventAsName && values.name !== currentName) {
                handleChange('name', currentName);
            }
        } else {
            const currentName = buildEventName(values.eventId, availableEvents);

            if (generateName && values.name !== currentName) {
                handleChange('name', currentName);
            }
        }
    }, [values, availableEvents, handleChange, generateName, useEventAsName, useCustom]);

    return (
        <DialogFormContextProvider<EventValues> formProps={props}>
            <DrawerFormLayout {...props}>
                <FormControlLabel
                    control={
                        <Checkbox
                            disabled={!!props.update}
                            name="useCustom"
                            checked={useCustom}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    handleChange('eventId', '');
                                    setGenerateName(true);
                                    setUseCustom(true);
                                } else {
                                    handleChange('eventId', '');
                                    setUseEventAsName(true);
                                    setUseCustom(false);
                                }
                            }}
                            color="primary"
                        />
                    }
                    label="Use Custom Browser Event"
                />
                {useCustom ? (
                    <>
                        <DialogFormTextInput
                            disabled={!!props.update}
                            name="browserEvent"
                            label="Custom Event"
                        />
                    </>
                ) : notAvailable ? (
                    <small>There are no more events available for this rule.</small>
                ) : (
                    <>
                        <DialogFormFilteredSelects
                            disabled={!!props.update}
                            initialFilterValue={props.initialPlatformId}
                            label="Event"
                            name="eventId"
                            values={availableEvents}
                            filterLabel="Platform"
                            missingSubMessage="There are no more events available from this platform."
                        />
                        <Box
                            component="small"
                            sx={{
                                width: '100%',
                                margin: (theme) => theme.spacing(0, 0, 2),
                            }}
                        >
                            {getDescription(values, availableEvents)}
                        </Box>
                        {props.values.mappedPlatformValues !== undefined &&
                            props.values.eventId !== '' && (
                                <MappedPlatformValuesForm
                                    mappedPlatformValues={props.values.mappedPlatformValues}
                                    parentLocators={[]}
                                    {...props}
                                />
                            )}
                    </>
                )}

                <FormControlLabel
                    control={
                        <Checkbox
                            name="useClearState"
                            checked={values.clearState !== -1}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    handleChange('clearState', 1000);
                                } else {
                                    handleChange('clearState', -1);
                                }
                            }}
                            color="primary"
                        />
                    }
                    label="Use timer to reset event state"
                />
                {values.clearState !== -1 && (
                    <DialogFormIntegerInput
                        name="clearState"
                        label="Reset event state after (milliseconds)"
                    />
                )}

                {useCustom ? (
                    <>
                        <FormControlLabel
                            sx={{ marginBottom: (theme) => theme.spacing(3) }}
                            control={
                                <Checkbox
                                    name="useEventAsName"
                                    checked={useEventAsName}
                                    onChange={(event) => {
                                        setUseEventAsName(event.target.checked);
                                    }}
                                    color="primary"
                                />
                            }
                            label="Use Custom Event as Name"
                        />
                        {!useEventAsName && <DialogFormTextInput name="name" label="Name" />}
                    </>
                ) : notAvailable ? null : (
                    <>
                        {props.values.mappedPlatformValues !== undefined &&
                            props.values.eventId !== '' && (
                                <>
                                    <FormControlLabel
                                        sx={{ marginBottom: (theme) => theme.spacing(3) }}
                                        control={
                                            <Checkbox
                                                name="generateName"
                                                checked={generateName}
                                                onChange={(event) => {
                                                    setGenerateName(event.target.checked);
                                                }}
                                                color="primary"
                                            />
                                        }
                                        label="Generate Name"
                                    />
                                    {!generateName && (
                                        <DialogFormTextInput name="name" label="Name" />
                                    )}
                                </>
                            )}
                    </>
                )}
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default EventForm;
