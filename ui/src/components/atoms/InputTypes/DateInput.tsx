import { TextField } from '@mui/material';
import { FC, ReactElement, useState } from 'react';
import {
    addMinutesUTC,
    dateToUTCTimestamp,
    getTimezoneOffset,
    startOfDayFromTimestamp,
    startOfMinuteUTC,
    subMinutesUTC,
    UTCTimestamp,
} from '../../../utils/DateTimeUtils';
import { DesktopDatePicker, DesktopDateTimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { InputBaseProps } from '@mui/material/InputBase';
import { FormProps } from '../../../hooks/form/useFormValidation';
import { TextFieldProps as MuiTextFieldPropsType } from '@mui/material/TextField/TextField';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import * as React from 'react';

export type DateInputProps = {
    name: string;
    label?: React.ReactNode;
    disabled?: boolean;
    onBlur?: InputBaseProps['onBlur'];
    value: UTCTimestamp | null;
    setValue: (v: UTCTimestamp | null) => void;
    required?: boolean;
    validationError?: string;
    className?: string;
    sx?: SxProps<Theme>;
    includeTime?: boolean;
};

export type ControlledDateInputProps<Values extends { [key: string]: any }> = Omit<
    DateInputProps,
    'value' | 'setValue'
> & {
    formProps: FormProps<Values>;
};

const DateInput: FC<DateInputProps> = ({
    name,
    label,
    value,
    setValue,
    validationError,
    className,
    sx,
    required,
    disabled,
    onBlur,
    includeTime,
}) => {
    const [requiredError, setRequiredError] = useState(false);

    const displayDateToValueWithTime = (date: Date) =>
        subMinutesUTC(dateToUTCTimestamp(date), getTimezoneOffset());

    const displayDateToValue = (date: Date, withTime: boolean) =>
        withTime
            ? startOfMinuteUTC(displayDateToValueWithTime(date))
            : startOfDayFromTimestamp(displayDateToValueWithTime(date));

    const valueToDisplayDate = (valueUTC: UTCTimestamp) =>
        new Date(addMinutesUTC(valueUTC, getTimezoneOffset()));

    const pickerDateInputProps: {
        renderInput: (props: MuiTextFieldPropsType) => ReactElement;
        onChange: (date: Date | null) => void;
        disabled: undefined | boolean;
        label?: React.ReactNode;
        inputFormat: string;
        value: Date | null;
    } = {
        label,
        value: value === null ? null : valueToDisplayDate(value),
        inputFormat: includeTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy',
        onChange: (date) => {
            setRequiredError(false);
            setValue(date === null ? null : displayDateToValue(date, !!includeTime));
        },
        disabled,
        renderInput: (params) => (
            <TextField
                {...params}
                error={validationError !== undefined || requiredError}
                helperText={requiredError ? 'Required value' : validationError}
                required={required}
                onBlur={onBlur}
                className={className}
                onInvalid={(event) => {
                    event.preventDefault();
                    setRequiredError(true);
                }}
                sx={{
                    minWidth: '200px',
                    ...(sx ?? {}),
                }}
                name={name}
            />
        ),
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {includeTime ? (
                <DesktopDateTimePicker {...pickerDateInputProps} />
            ) : (
                <DesktopDatePicker {...pickerDateInputProps} />
            )}
        </LocalizationProvider>
    );
};

export default DateInput;
