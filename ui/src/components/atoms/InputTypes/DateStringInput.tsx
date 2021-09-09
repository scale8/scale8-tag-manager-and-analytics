import { FC } from 'react';
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import DateInput from './DateInput';
import {
    dataMapStringToUTCTimestamp,
    timestampToDataMapString,
    UTCNow,
} from '../../../utils/DateTimeUtils';

export type DateStringInputProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
    name: string;
    value: string;
    setValue: (v: string) => void;
    required: boolean;
    validationError?: string;
};

const DateStringInput: FC<DateStringInputProps> = (props: DateStringInputProps) => {
    const { name, value, setValue, validationError, required, ...datePickerProps } = props;

    return (
        <DateInput
            name={name}
            value={value !== '' ? dataMapStringToUTCTimestamp(value) : null}
            setValue={(date) => {
                if (date === null) {
                    if (required) {
                        setValue(timestampToDataMapString(UTCNow));
                    } else {
                        setValue('');
                    }
                } else {
                    setValue(timestampToDataMapString(date));
                }
            }}
            validationError={validationError}
            required={required}
            {...datePickerProps}
        />
    );
};

export default DateStringInput;
