import { ChangeEvent, FC, useState } from 'react';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';

export type FloatInputProps = TextFieldProps & {
    name: string;
    value: number | '';
    setValue: (v: number | '') => void;
    validationError?: string;
};

const FloatInput: FC<FloatInputProps> = (props: FloatInputProps) => {
    const { name, value, setValue, validationError, ...textFieldProps } = props;
    const [trailingDecimalPoint, setTrailingDecimalPoint] = useState(false);
    const [trailingZeros, setTrailingZeros] = useState('');

    const [requiredError, setRequiredError] = useState(false);

    return (
        <TextField
            value={
                value === null ? '' : `${value}${trailingDecimalPoint ? '.' : ''}${trailingZeros}`
            }
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
                if (
                    (event.target.value.match(/\./g) || []).length === 1 &&
                    /\.0*$/.test(event.target.value)
                ) {
                    setTrailingDecimalPoint(true);
                } else {
                    setTrailingDecimalPoint(false);
                }
                if (event.target.value.includes('.')) {
                    const zeros = event.target.value.match(/(0+)$/);
                    if (zeros !== null) {
                        setTrailingZeros(zeros[1]);
                    } else {
                        setTrailingZeros('');
                    }
                } else {
                    setTrailingZeros('');
                }

                const newValue = parseFloat(event.target.value);
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

export default FloatInput;
