import { FC } from 'react';
import { DateTimePickerProps } from '@material-ui/pickers';
import DateTimeInput from './DateTimeInput';
import {
    dataMapStringToUTCTimestamp,
    timestampToDataMapString,
    UTCNow,
} from '../../../utils/DateTimeUtils';

export type DateTimeStringInputProps = Omit<DateTimePickerProps, 'onChange'> & {
    name: string;
    value: string;
    setValue: (v: string) => void;
    required: boolean;
    validationError?: string;
};

const DateTimeStringInput: FC<DateTimeStringInputProps> = (props: DateTimeStringInputProps) => {
    const { name, value, setValue, validationError, required, ...datePickerProps } = props;

    return (
        <DateTimeInput
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

export default DateTimeStringInput;
