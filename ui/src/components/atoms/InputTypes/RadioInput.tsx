import { ChangeEvent, FC, useState } from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    FormControlProps,
    FormHelperText,
    Radio,
    RadioGroup,
} from '@material-ui/core';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';

export type SelectInputProps = Omit<FormControlProps, 'children'> & {
    name: string;
    value: string;
    defaultValue: string;
    label?: string;
    setValue: (v: string) => void;
    validationError?: string;
    optionValues: S8DataMapValue[];
    keyTextValues?: SelectValueWithSub[];
};

const RadioInput: FC<SelectInputProps> = (props: SelectInputProps) => {
    const {
        name,
        value,
        label,
        setValue,
        validationError,
        optionValues,
        keyTextValues,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        required,
        disabled,
        defaultValue,
        ...formControlProps
    } = props;

    const [requiredError, setRequiredError] = useState(false);

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        setRequiredError(false);
        setValue(event.target.value as string);
    };

    const sortedOptions = [...optionValues].sort();

    return (
        <FormControl
            {...formControlProps}
            onInvalid={(event) => {
                event.preventDefault();
                setRequiredError(true);
            }}
            error={validationError !== undefined || requiredError}
            disabled={disabled}
        >
            {label && (
                <Box
                    color={disabled ? 'rgba(0, 0, 0, 0.38)' : 'inherit'}
                    style={{
                        fontSize: '12px',
                    }}
                >
                    {label}
                </Box>
            )}
            <RadioGroup
                value={
                    sortedOptions.includes(value)
                        ? value
                        : sortedOptions.includes(defaultValue)
                        ? defaultValue
                        : sortedOptions[0]
                }
                onChange={handleChange}
                name={name}
            >
                {sortedOptions.map((v, key) => (
                    <FormControlLabel
                        key={key}
                        value={v.toString()}
                        control={<Radio />}
                        label={v.toString()}
                    />
                ))}
                {keyTextValues !== undefined &&
                    [...keyTextValues]
                        .sort((a, b) => (a.text > b.text ? 1 : -1))
                        .map((value, key) => (
                            <FormControlLabel
                                key={key}
                                value={value.key}
                                control={<Radio />}
                                label={value.text}
                            />
                        ))}
            </RadioGroup>

            {validationError !== undefined && <FormHelperText>{validationError}</FormHelperText>}
            {requiredError && <FormHelperText>Please select a value</FormHelperText>}
        </FormControl>
    );
};

export default RadioInput;
