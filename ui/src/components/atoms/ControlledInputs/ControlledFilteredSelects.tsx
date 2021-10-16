import { ReactElement, useState } from 'react';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import {
    ControlledFilteredSelectProps,
    SelectValueWithSub,
} from '../../../hooks/form/useFormValidation';
import SelectValueMenuItem from '../SelectValueMenuItem';
import { selectCompare } from '../../../utils/SelectUtils';

const ControlledFilteredSelects = <T extends { [key: string]: any }>(
    props: ControlledFilteredSelectProps<T>,
): ReactElement => {
    const {
        name,
        formProps,
        label,
        values,
        filterLabel,
        missingSubMessage,
        initialFilterValue,
        hideNoSub,
        ...formControlProps
    } = props;

    const [filterValue, setFilterValue] = useState(initialFilterValue ?? '');
    const [requiredError, setRequiredError] = useState(false);
    const [requiredFilterError, setRequiredFilterError] = useState(false);

    const handleFilterChange = (event: SelectChangeEvent) => {
        setRequiredFilterError(false);
        setFilterValue(event.target.value as string);
        formProps.handleChange(name, '');
    };

    const handleChange = (event: SelectChangeEvent) => {
        setRequiredError(false);
        formProps.handleChange(name, event.target.value);
    };

    const hasSub = values.every((_) => _.sub !== undefined);

    const filteredValue = values.find((_) => _.key === filterValue);
    const filteredValues: SelectValueWithSub[] = hasSub
        ? filteredValue && filteredValue.sub
            ? filteredValue.sub
            : []
        : values;

    const filterValues = hideNoSub
        ? values.filter((_) => _.sub !== undefined && _.sub.length > 0)
        : values;

    return (
        <>
            {hasSub && (
                <FormControl
                    className={formControlProps.className}
                    onInvalid={(event) => {
                        event.preventDefault();
                        setRequiredFilterError(true);
                    }}
                    error={requiredFilterError}
                    required
                >
                    <InputLabel>{filterLabel}</InputLabel>
                    <Select
                        value={filterValue}
                        disabled={props.disabled}
                        onChange={handleFilterChange}
                        onBlur={formProps.handleBlur}
                        name={name}
                    >
                        {[...filterValues].sort(selectCompare).map((_) => (
                            <MenuItem key={_.key} value={_.key}>
                                <SelectValueMenuItem selectValue={_} />
                            </MenuItem>
                        ))}
                    </Select>
                    {requiredFilterError && <FormHelperText>Please select a value</FormHelperText>}
                </FormControl>
            )}
            {(!hasSub || filterValue !== '') &&
                (filteredValues.length < 1 ? (
                    <small>{missingSubMessage}</small>
                ) : (
                    <FormControl
                        {...formControlProps}
                        onInvalid={(event) => {
                            event.preventDefault();
                            setRequiredError(true);
                        }}
                        error={!!formProps.errors[props.name] || requiredError}
                    >
                        <InputLabel>{label}</InputLabel>
                        <Select
                            value={formProps.values[name]}
                            onChange={handleChange}
                            onBlur={formProps.handleBlur}
                            name={name}
                        >
                            {[...filteredValues].sort(selectCompare).map((_) => (
                                <MenuItem key={_.key} value={_.key}>
                                    <SelectValueMenuItem selectValue={_} />
                                </MenuItem>
                            ))}
                        </Select>
                        {!!formProps.errors[props.name] && (
                            <FormHelperText>{formProps.errors[props.name]}</FormHelperText>
                        )}
                        {requiredError && <FormHelperText>Please select a value</FormHelperText>}
                    </FormControl>
                ))}
        </>
    );
};

export default ControlledFilteredSelects;
