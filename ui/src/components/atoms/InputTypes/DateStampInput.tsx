import { FC } from 'react';
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import DateInput from './DateInput';
import { UTCNow } from '../../../utils/DateTimeUtils';

export type DateStampInputProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
    name: string;
    value: number | '';
    setValue: (v: number | '') => void;
    required: boolean;
    validationError?: string;
};

const DateStampInput: FC<DateStampInputProps> = (props: DateStampInputProps) => {
    const { name, value, setValue, validationError, required, ...datePickerProps } = props;

    return (
        <DateInput
            name={name}
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
            validationError={validationError}
            required={required}
            {...datePickerProps}
        />
    );
};

export default DateStampInput;
