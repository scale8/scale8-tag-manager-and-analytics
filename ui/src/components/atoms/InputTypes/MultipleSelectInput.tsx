import { FC, useState } from 'react';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import { TextFieldProps } from '@mui/material/TextField/TextField';

export type MultipleSelectInputProps = TextFieldProps & {
    name: string;
    value: string[];
    label?: string;
    setValue: (v: string[]) => void;
    validationError?: string;
    optionValues: S8DataMapValue[];
};

const MultipleSelectInput: FC<MultipleSelectInputProps> = (props: MultipleSelectInputProps) => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        name,
        value,
        setValue,
        validationError,
        optionValues,
        required,
        disabled,
        ...inputProps
    } = props;

    const [requiredError, setRequiredError] = useState(false);

    return (
        <Autocomplete
            multiple
            onInvalid={(event) => {
                event.preventDefault();
                setRequiredError(true);
            }}
            defaultValue={[]}
            options={optionValues}
            value={value ?? []}
            onChange={(_, value) => {
                setRequiredError(false);
                setValue((value ?? []) as string[]);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    error={validationError !== undefined || requiredError}
                    helperText={requiredError ? 'Required value' : validationError}
                    required={required && (value as string[]).length === 0} // check array
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: autocompleteOff,
                    }}
                    disabled={disabled}
                    {...inputProps}
                />
            )}
            disabled={disabled}
        />
    );
};

export default MultipleSelectInput;
