import { FC, useState } from 'react';
import { TextField } from '@material-ui/core';
import { SelectIntValue } from '../../../hooks/form/useFormValidation';
import { Autocomplete } from '@material-ui/lab';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import SelectInput from './SelectInput';

export type IntegerSelectInputProps = TextFieldProps & {
    multiple: boolean;
    name: string;
    value: number[] | number | '';
    label?: string;
    setValue: (v: number[] | number) => void;
    validationError?: string;
    keyTextValues: SelectIntValue[];
};

const IntegerSelectInput: FC<IntegerSelectInputProps> = (props: IntegerSelectInputProps) => {
    const {
        name,
        multiple,
        value,
        setValue,
        validationError,
        keyTextValues,
        required,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onChange,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultValue,
        disabled,
        ...inputProps
    } = props;

    const [requiredError, setRequiredError] = useState(false);

    if (multiple) {
        return (
            <Autocomplete
                multiple={multiple}
                onInvalid={(event) => {
                    event.preventDefault();
                    setRequiredError(true);
                }}
                defaultValue={[]}
                options={keyTextValues}
                getOptionLabel={(option) => (option === undefined ? '' : option.text)}
                value={(value as number[])
                    .map((_) => keyTextValues.find((v) => v.key === _))
                    .filter((_) => _ !== undefined)}
                onChange={(_, value) => {
                    setRequiredError(false);
                    setValue(value.map((_) => (_ as SelectIntValue).key));
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        error={validationError !== undefined || requiredError}
                        helperText={requiredError ? 'Required value' : validationError}
                        required={required && (value as number[]).length === 0} // check array
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
    } else {
        return (
            <SelectInput
                value={value.toString()}
                setValue={(v) => setValue(parseInt(v))}
                optionValues={[]}
                keyTextValues={keyTextValues.map((_) => ({
                    key: _.key.toString(),
                    text: _.text,
                }))}
                name={name}
                label={props.label}
                required={required}
                disabled={disabled}
            />
        );
    }
};

export default IntegerSelectInput;
