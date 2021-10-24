import { ReactElement, useState } from 'react';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    ListSubheader,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { ControlledSelectProps, SelectValueWithSub } from '../../../hooks/form/useFormValidation';
import SelectValueMenuItem from '../SelectValueMenuItem';
import { selectCompare } from '../../../utils/SelectUtils';

const ControlledSelect = <T extends { [key: string]: any }>(
    props: ControlledSelectProps<T>,
): ReactElement => {
    const {
        name,
        formProps,
        label,
        values,
        requiredOnValidation,
        resetErrorsOnKeys,
        ...formControlProps
    } = props;

    const inputLabel =
        requiredOnValidation !== undefined && requiredOnValidation ? `${label} *` : label;

    const [requiredError, setRequiredError] = useState(false);

    const extraValues = resetErrorsOnKeys
        ? resetErrorsOnKeys.map((_) => ({ valueKey: _, value: '' }))
        : undefined;

    const handleChange = (event: SelectChangeEvent) => {
        setRequiredError(false);
        formProps.handleChange(name, event.target.value, extraValues);
    };

    const subSelectItems = (
        value: SelectValueWithSub,
    ): {
        isHeader: boolean;
        key: string;
        text: string;
        icon?: JSX.Element;
    }[] =>
        value.sub
            ? [
                  { isHeader: true, key: value.key, text: value.text },
                  value.sub
                      .map((subValue) => ({
                          isHeader: false,
                          key: subValue.key,
                          text: subValue.text,
                          icon: subValue.icon,
                      }))
                      .sort(selectCompare),
              ].flat()
            : [];

    return (
        <FormControl
            variant="standard"
            {...formControlProps}
            onInvalid={(event) => {
                event.preventDefault();
                setRequiredError(true);
            }}
            error={!!formProps.errors[props.name] || requiredError}
        >
            <InputLabel>{inputLabel}</InputLabel>
            <Select
                label={inputLabel}
                value={formProps.values[name]}
                onChange={handleChange}
                onBlur={formProps.handleBlur}
                name={name}
            >
                {props.allowEmpty && <MenuItem value="">--Not Set--</MenuItem>}

                {[...values]
                    .filter((value) => value.sub === undefined)
                    .sort(selectCompare)
                    .map((value, key) => (
                        <MenuItem key={key} value={value.key}>
                            <SelectValueMenuItem selectValue={value} />
                        </MenuItem>
                    ))}

                {[...values]
                    .filter((value) => value.sub !== undefined)
                    .sort(selectCompare)
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
                                    <SelectValueMenuItem selectValue={subSelectItem} />
                                </MenuItem>
                            ),
                        ),
                    )}
            </Select>
            {!!formProps.errors[props.name] && (
                <FormHelperText>{formProps.errors[props.name]}</FormHelperText>
            )}
            {requiredError && <FormHelperText>Please select a value</FormHelperText>}
        </FormControl>
    );
};

export default ControlledSelect;
