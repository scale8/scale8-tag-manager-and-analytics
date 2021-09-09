import { TextField } from '@material-ui/core';
import { ChangeEvent, FC, useState } from 'react';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';

export type NumberInRangeInputProps = TextFieldProps & {
    name: string;
    value: number | '';
    setValue: (v: number | '') => void;
    validationError?: string;
    max: string;
};

const PositiveInRangeInput: FC<NumberInRangeInputProps> = (props: NumberInRangeInputProps) => {
    const { name, value, setValue, max, validationError, ...textFieldProps } = props;

    const [inputError, setInputError] = useState(false);

    return (
        <TextField
            value={value.toString()}
            onInvalid={(event) => {
                event.preventDefault();
                setInputError(true);
            }}
            onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                setInputError(false);
                const calculateValue = () => {
                    if (event.target.value === '') return 0;
                    if (parseInt(event.target.value) > parseInt(max)) return parseInt(max);
                    return parseInt(event.target.value);
                };

                setValue(calculateValue());
            }}
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            name={name}
            error={validationError !== undefined || inputError}
            helperText={inputError ? `Enter a numeric value between 0 and ${max}` : validationError}
            inputProps={{
                autoComplete: autocompleteOff,
                min: 0,
                max,
            }}
            {...textFieldProps}
        />
    );
};

export default PositiveInRangeInput;
