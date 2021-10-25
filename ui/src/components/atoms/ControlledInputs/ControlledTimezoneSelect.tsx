import { ReactElement, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { ControlledInputProps } from '../../../hooks/form/useFormValidation';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import { getTimezoneLabel } from '../../../utils/TimezoneUtils';

export const ControlledTimezoneSelect = <T extends { [key: string]: any }>(
    props: ControlledInputProps<T>,
): ReactElement => {
    const { name, formProps, ...textFieldProps } = props;

    const [requiredError, setRequiredError] = useState(false);

    const timezones: string[] = [];

    const timeZoneValue = timezones.find((timezone) => timezone === formProps.values[name]) || null;

    const timeZoneLabel = timeZoneValue === null ? null : getTimezoneLabel(timeZoneValue);

    return (
        <Autocomplete
            sx={{
                '& .MuiAutocomplete-option': {
                    fontSize: '15px',
                    '& > span': {
                        marginRight: '10px',
                        fontSize: '18px',
                    },
                },
            }}
            value={timeZoneLabel}
            isOptionEqualToValue={(option, value) => getTimezoneLabel(option) === value}
            onInvalid={(event) => {
                event.preventDefault();
                setRequiredError(true);
            }}
            onChange={(_, value) => {
                setRequiredError(false);
                formProps.handleChange(name, value);
            }}
            onBlur={formProps.handleBlur}
            options={[...timezones].sort((a, b) =>
                getTimezoneLabel(a) > getTimezoneLabel(b) ? 1 : -1,
            )}
            autoHighlight
            getOptionLabel={(option) => option}
            renderOption={(props, option) => getTimezoneLabel(option)}
            renderInput={(params) => (
                <TextField
                    variant="standard"
                    {...textFieldProps}
                    {...params}
                    error={!!formProps.errors[props.name] || requiredError}
                    helperText={
                        requiredError ? 'Please select a value' : formProps.errors[props.name]
                    }
                    label="Timezone"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: autocompleteOff,
                    }}
                />
            )}
        />
    );
};
