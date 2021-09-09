import { Box, IconButton } from '@material-ui/core';
import { FC, useEffect } from 'react';
import { DateTimePicker, DateTimePickerProps, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import CloseIcon from '@material-ui/icons/Close';
import {
    dateTimePickerDateUtils,
    dateToUTCTimestampOrNull,
    UTCNow,
    UTCTimestamp,
} from '../../../utils/DateTimeUtils';

export type DateTimeInputProps = Omit<DateTimePickerProps, 'value' | 'onChange'> & {
    name: string;
    value: UTCTimestamp | null;
    setValue: (v: UTCTimestamp | null) => void;
    required: boolean;
    validationError?: string;
};

const DateTimeInput: FC<DateTimeInputProps> = (props: DateTimeInputProps) => {
    const { name, value, setValue, validationError, required, disabled, ...datePickerProps } =
        props;

    useEffect(() => {
        if (required && !disabled && value === null) {
            setValue(UTCNow);
        }
    }, [value, required, setValue]);

    return (
        <MuiPickersUtilsProvider utils={dateTimePickerDateUtils}>
            <div>
                <DateTimePicker
                    autoOk
                    variant="inline"
                    value={value}
                    format="dd/MM/yyyy HH:mm:ss"
                    name={name}
                    error={validationError !== undefined}
                    helperText={validationError}
                    required={required}
                    onChange={(date: MaterialUiPickersDate) => {
                        if (date === null && required) {
                            setValue(UTCNow);
                        } else {
                            setValue(dateToUTCTimestampOrNull(date, true));
                        }
                    }}
                    disabled={disabled}
                    {...datePickerProps}
                />
                {!required && !disabled && (
                    <Box display="inline-box" position="relative">
                        <IconButton
                            style={{
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
        </MuiPickersUtilsProvider>
    );
};

export default DateTimeInput;
