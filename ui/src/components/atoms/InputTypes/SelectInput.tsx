import { FC, useState } from 'react';
import {
    FormControl,
    FormControlProps,
    FormHelperText,
    InputLabel,
    ListSubheader,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';

export type SelectInputProps = Omit<FormControlProps, 'children'> & {
    name: string;
    value: string;
    label?: string;
    setValue: (v: string) => void;
    validationError?: string;
    optionValues: S8DataMapValue[];
    keyTextValues?: SelectValueWithSub[];
};

const SelectInput: FC<SelectInputProps> = (props: SelectInputProps) => {
    const {
        name,
        value,
        label,
        setValue,
        validationError,
        optionValues,
        keyTextValues,
        required,
        ...formControlProps
    } = props;

    const [requiredError, setRequiredError] = useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        setRequiredError(false);
        setValue(event.target.value as string);
    };

    const subSelectItems = (
        value: SelectValueWithSub,
    ): {
        isHeader: boolean;
        key: string;
        text: string;
    }[] =>
        value.sub
            ? [
                  { isHeader: true, key: value.key, text: value.text },
                  value.sub
                      .map((subValue) => ({
                          isHeader: false,
                          key: subValue.key,
                          text: subValue.text,
                      }))
                      .sort((a, b) => (a.text > b.text ? 1 : -1)),
              ].flat()
            : [];

    return (
        <FormControl
            {...formControlProps}
            onInvalid={(event) => {
                event.preventDefault();
                setRequiredError(true);
            }}
            error={validationError !== undefined || requiredError}
            required={required}
        >
            {label && <InputLabel>{label}</InputLabel>}
            <Select label={label} value={value} onChange={handleChange} name={name}>
                {!required && <MenuItem value="">--Not Set--</MenuItem>}

                {[...optionValues].sort().map((v, key) => (
                    <MenuItem key={key} value={v.toString()}>
                        {v.toString()}
                    </MenuItem>
                ))}
                {keyTextValues !== undefined &&
                    [...keyTextValues]
                        .filter((value) => value.sub === undefined)
                        .sort((a, b) => (a.text > b.text ? 1 : -1))
                        .map((value, key) => (
                            <MenuItem key={key} value={value.key}>
                                {value.text}
                            </MenuItem>
                        ))}

                {keyTextValues !== undefined &&
                    [...keyTextValues]
                        .filter((value) => value.sub !== undefined)
                        .sort((a, b) => (a.text > b.text ? 1 : -1))
                        .map((value) =>
                            [...subSelectItems(value)].map((subSelectItem) =>
                                subSelectItem.isHeader ? (
                                    <ListSubheader
                                        key={subSelectItem.key}
                                        value=""
                                        disableSticky={true}
                                    >
                                        {subSelectItem.text}
                                    </ListSubheader>
                                ) : (
                                    <MenuItem key={subSelectItem.key} value={subSelectItem.key}>
                                        {subSelectItem.text}
                                    </MenuItem>
                                ),
                            ),
                        )}
            </Select>
            {validationError !== undefined && <FormHelperText>{validationError}</FormHelperText>}
            {requiredError && <FormHelperText>Please select a value</FormHelperText>}
        </FormControl>
    );
};

export default SelectInput;
