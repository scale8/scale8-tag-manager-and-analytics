import { useTheme } from '@material-ui/core/styles';
import { FC, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import ControlledFilteredSelects from '../../atoms/ControlledInputs/ControlledFilteredSelects';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';
import { controlledSelectValuesFindByInnerKey } from '../../../utils/ControlledSelectUtils';
import { MappedPlatformValuesForm } from '../../molecules/MappedPlatformValues/MappedPlatformValuesForm';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import ControlledIntegerInput from '../../atoms/ControlledInputs/ControlledIntegerInput';
import {
    EventFormProps,
    EventValues,
} from '../../../dialogPages/tagManager/app/trigger/EventCreate';
import { buildEventName } from '../../../dialogPages/tagManager/app/trigger/EventUpdate';

const getDescription = (values: EventValues, availableEvents: SelectValueWithSub[]): string => {
    if (!values.eventId) {
        return '';
    }

    const selectedEvent = controlledSelectValuesFindByInnerKey(availableEvents, values.eventId);

    return selectedEvent?.description ?? '';
};

const EventForm: FC<EventFormProps> = (props: EventFormProps) => {
    const theme = useTheme();
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
                    <ControlledTextInput
                        disabled={!!props.update}
                        name="browserEvent"
                        label="Custom Event"
                        formProps={props}
                        className="DrawerFormField"
                        required
                    />
                </>
            ) : notAvailable ? (
                <small>There are no more events available for this rule.</small>
            ) : (
                <>
                    <ControlledFilteredSelects
                        disabled={!!props.update}
                        className="DrawerFormField"
                        initialFilterValue={props.initialPlatformId}
                        label="Event"
                        name="eventId"
                        values={availableEvents}
                        formProps={props}
                        required
                        filterLabel="Platform"
                        missingSubMessage="There are no more events available from this platform."
                        hideNoSub
                    />
                    <small
                        style={{
                            width: '100%',
                            margin: theme.spacing(0, 0, 2),
                        }}
                    >
                        {getDescription(values, availableEvents)}
                    </small>
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
                <ControlledIntegerInput
                    name="clearState"
                    label="Reset event state after (milliseconds)"
                    formProps={props}
                    className="DrawerFormField"
                    required
                />
            )}

            {useCustom ? (
                <>
                    <FormControlLabel
                        style={{ marginBottom: theme.spacing(3) }}
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
                    {!useEventAsName && (
                        <ControlledTextInput
                            name="name"
                            label="Name"
                            formProps={props}
                            className="DrawerFormField"
                            required
                        />
                    )}
                </>
            ) : notAvailable ? null : (
                <>
                    {props.values.mappedPlatformValues !== undefined &&
                        props.values.eventId !== '' && (
                            <>
                                <FormControlLabel
                                    style={{ marginBottom: theme.spacing(3) }}
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
                                    <ControlledTextInput
                                        name="name"
                                        label="Name"
                                        formProps={props}
                                        className="DrawerFormField"
                                        required
                                    />
                                )}
                            </>
                        )}
                </>
            )}
            <ControlledTextAreaInput
                name="comments"
                label="Comments"
                formProps={props}
                className="DrawerFormField"
            />
        </DrawerFormLayout>
    );
};

export default EventForm;
