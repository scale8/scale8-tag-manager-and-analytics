import { TextField } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';

export type IntegerInputProps = TextFieldProps & {
    name: string;
    value: number | '';
    setValue: (v: number | '') => void;
    validationError?: string;
};

const IntegerInput: FC<IntegerInputProps> = (props: IntegerInputProps) => {
    const { name, value, setValue, validationError, ...textFieldProps } = props;

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
                if (event.target.value === '') {
                    setValue('');
                    return;
                }
                const previousValue = value;
                const newValue = parseInt(event.target.value);
                setValue(isNaN(newValue) ? previousValue : newValue);
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

export default IntegerInput;
