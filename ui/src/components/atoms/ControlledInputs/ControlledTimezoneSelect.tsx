import { ReactElement, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { ControlledInputProps } from '../../../hooks/form/useFormValidation';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import { getTimezoneLabel } from '../../../utils/TimezoneUtils';

const useStyles = makeStyles({
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

const ControlledTimezoneSelect = <T extends { [key: string]: any }>(
    props: ControlledInputProps<T>,
): ReactElement => {
    const classes = useStyles();
    const { name, formProps, ...textFieldProps } = props;

    const [requiredError, setRequiredError] = useState(false);

    const timezones: string[] = [];

    const timeZoneValue = timezones.find((timezone) => timezone === formProps.values[name]) || null;

    const timeZoneLabel = timeZoneValue === null ? null : getTimezoneLabel(timeZoneValue);

    return (
        <Autocomplete
            value={timeZoneLabel}
            getOptionSelected={(option, value) => getTimezoneLabel(option) === value}
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
            classes={{
                option: classes.option,
            }}
            autoHighlight
            getOptionLabel={(option) => option}
            renderOption={(option) => getTimezoneLabel(option)}
            renderInput={(params) => (
                <TextField
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

export default ControlledTimezoneSelect;
