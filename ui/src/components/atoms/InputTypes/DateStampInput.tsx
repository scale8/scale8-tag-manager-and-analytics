import { FC } from 'react';
import DateInput, { DateInputProps } from './DateInput';
import { UTCNow } from '../../../utils/DateTimeUtils';

export type DateStampInputProps = Omit<DateInputProps, 'value' | 'setValue'> & {
    value: number | '';
    setValue: (v: number | '') => void;
};

const DateStampInput: FC<DateStampInputProps> = (props: DateStampInputProps) => {
    const { value, setValue, required, ...dateInputProps } = props;

    return (
        <DateInput
            value={value !== '' ? value : null}
            setValue={(date) => {
                if (date === null) {
                    if (required) {
                        setValue(UTCNow);
                    } else {
                        setValue('');
                    }
                } else {
                    setValue(date);
                }
            }}
            required={required}
            {...dateInputProps}
        />
    );
};

export default DateStampInput;
