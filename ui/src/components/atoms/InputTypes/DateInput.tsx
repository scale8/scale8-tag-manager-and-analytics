import { Box, IconButton, TextField } from '@mui/material';
import { FC, ReactElement, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { UTCNow, UTCTimestamp } from '../../../utils/DateTimeUtils';
import { DesktopDatePicker, DesktopDateTimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
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
    useEffect(() => {
        if (required && !disabled && value === null) {
            setValue(UTCNow);
        }
    }, [value, required, setValue]);

    const pickerDateInputProps: {
        renderInput: (props: MuiTextFieldPropsType) => ReactElement;
        onChange: (date: UTCTimestamp | null) => void;
        disabled: undefined | boolean;
        label?: React.ReactNode;
        inputFormat: string;
        value: number | null;
    } = {
        label,
        value,
        inputFormat: includeTime ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm:ss',
        onChange: (date) => {
            if (date === null && required) {
                setValue(UTCNow);
            } else {
                setValue(date);
            }
        },
        disabled,
        renderInput: (params) => (
            <TextField
                {...params}
                error={validationError !== undefined}
                helperText={validationError}
                required={required}
                onBlur={onBlur}
                className={className}
                sx={sx}
                name={name}
            />
        ),
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                {includeTime ? (
                    <DesktopDateTimePicker {...pickerDateInputProps} />
                ) : (
                    <DesktopDatePicker {...pickerDateInputProps} />
                )}
                {!required && !disabled && (
                    <Box display="inline-box" position="relative">
                        <IconButton
                            sx={{
                                marginLeft: -25,
                                marginTop: 0,
                                position: 'absolute',
                            }}
                            aria-label="empty"
                            onClick={() => {
                                setValue(null);
                            }}
                            size="small"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default DateInput;
