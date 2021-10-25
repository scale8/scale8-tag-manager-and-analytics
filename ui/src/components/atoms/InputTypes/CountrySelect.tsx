import { FC, ReactElement, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import { countryCodes, countryToFlag, getCountryLabel } from '../../../utils/CountryUtils';

export type CountrySelectProps = TextFieldProps & {
    name: string;
    value: string;
    label: string;
    setValue: (v: string) => void;
    validationError?: string;
};

const CountrySelect: FC<CountrySelectProps> = (props: CountrySelectProps): ReactElement => {
    const { name, value, setValue, validationError, disabled, ...textFieldProps } = props;

    const [requiredError, setRequiredError] = useState(false);

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
                    variant="standard"
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
