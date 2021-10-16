import { Box, IconButton } from '@mui/material';
import { FC, useEffect } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import CloseIcon from '@mui/icons-material/Close';
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import {
    dateTimePickerDateUtils,
    dateToUTCTimestampOrNull,
    UTCNow,
    UTCTimestamp,
} from '../../../utils/DateTimeUtils';

export type DateInputProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
    name: string;
    value: UTCTimestamp | null;
    setValue: (v: UTCTimestamp | null) => void;
    required: boolean;
    validationError?: string;
};

const DateInput: FC<DateInputProps> = (props: DateInputProps) => {
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
                <DatePicker
                    autoOk
                    variant="inline"
                    value={value}
                    format="dd/MM/yyyy"
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

export default DateInput;
