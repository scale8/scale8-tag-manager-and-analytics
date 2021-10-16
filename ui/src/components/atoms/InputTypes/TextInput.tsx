import { TextField } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';

export type TextInputProps = TextFieldProps & {
    name: string;
    value: string;
    setValue: (v: string) => void;
    validationError?: string;
};

const TextInput: FC<TextInputProps> = (props: TextInputProps) => {
    const { name, value, setValue, validationError, ...textFieldProps } = props;

    const [requiredError, setRequiredError] = useState(false);

    return (
        <TextField
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
            {...textFieldProps}
        />
    );
};

export default TextInput;
