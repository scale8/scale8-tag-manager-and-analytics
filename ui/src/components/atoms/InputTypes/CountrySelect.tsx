import { FC, ReactElement, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import makeStyles from '@mui/styles/makeStyles';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import { countryCodes, countryToFlag, getCountryLabel } from '../../../utils/CountryUtils';

const useStyles = makeStyles({
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

export type CountrySelectProps = TextFieldProps & {
    name: string;
    value: string;
    label: string;
    setValue: (v: string) => void;
    validationError?: string;
};

const CountrySelect: FC<CountrySelectProps> = (props: CountrySelectProps): ReactElement => {
    const classes = useStyles();
    const { name, value, setValue, validationError, disabled, ...textFieldProps } = props;

    const [requiredError, setRequiredError] = useState(false);

    return (
        <Autocomplete
            value={value === '' ? null : getCountryLabel(value)}
            isOptionEqualToValue={(option, value) => getCountryLabel(option) === value}
            onInvalid={(event) => {
                event.preventDefault();
                setRequiredError(true);
            }}
            onChange={(_, value) => {
                setRequiredError(false);
                setValue(value ?? '');
            }}
            options={countryCodes.sort((a, b) =>
                getCountryLabel(a) > getCountryLabel(b) ? 1 : -1,
            )}
            classes={{
                option: classes.option,
            }}
            autoHighlight
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
                <>
                    <span>{countryToFlag(option)}</span>
                    {getCountryLabel(option)} ({option})
                </>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={validationError !== undefined || requiredError}
                    helperText={requiredError ? 'Required value' : validationError}
                    name={name}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: autocompleteOff,
                    }}
                    disabled={disabled}
                    {...textFieldProps}
                />
            )}
            disabled={disabled}
        />
    );
};

export default CountrySelect;
