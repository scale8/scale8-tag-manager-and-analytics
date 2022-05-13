import { InputAdornment, TextField } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

export type TextInputProps = TextFieldProps & {
    name: string;
    value: string;
    setValue: (v: string) => void;
    validationError?: string;
    clearable?: boolean;
};

const TextInput: FC<TextInputProps> = (props: TextInputProps) => {
    const { name, value, setValue, validationError, InputProps, clearable, ...textFieldProps } =
        props;

    const [requiredError, setRequiredError] = useState(false);

    return (
        <TextField
            variant="standard"
            value={value}
            onInvalid={(event) => {
                event.preventDefault();
                setRequiredError(true);
            }}
            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                setRequiredError(false);
                setValue(event.target.value);
            }}
            name={name}
            error={validationError !== undefined || requiredError}
            helperText={requiredError ? 'Required value' : validationError}
            inputProps={{
                autoComplete: autocompleteOff,
            }}
            InputProps={{
                ...(clearable && !textFieldProps.disabled
                    ? {
                          endAdornment: (
                              <InputAdornment position="end">
                                  <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={() => setValue('')}
                                      size="large"
                                  >
                                      <ClearIcon />
                                  </IconButton>
                              </InputAdornment>
                          ),
                      }
                    : {}),
                ...InputProps,
            }}
            {...textFieldProps}
        />
    );
};

export default TextInput;
