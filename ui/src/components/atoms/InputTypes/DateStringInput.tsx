import { FC } from 'react';
import DateInput, { DateInputProps } from './DateInput';
import {
    dataMapStringToUTCTimestamp,
    timestampToDataMapString,
    UTCNow,
} from '../../../utils/DateTimeUtils';

export type DateStringInputProps = Omit<DateInputProps, 'value' | 'setValue'> & {
    value: string;
    setValue: (v: string) => void;
};

const DateStringInput: FC<DateStringInputProps> = (props: DateStringInputProps) => {
    const { value, setValue, required, ...dateInputProps } = props;

    return (
        <DateInput
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
            required={required}
            {...dateInputProps}
        />
    );
};

export default DateStringInput;
