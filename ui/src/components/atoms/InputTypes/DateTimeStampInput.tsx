import { FC } from 'react';
import { DateTimePickerProps } from '@material-ui/pickers';
import DateTimeInput from './DateTimeInput';
import { UTCNow } from '../../../utils/DateTimeUtils';

export type DateTimeStampInputProps = Omit<DateTimePickerProps, 'value' | 'onChange'> & {
    name: string;
    value: number | '';
    setValue: (v: number | '') => void;
    required: boolean;
    validationError?: string;
};

const DateTimeStampInput: FC<DateTimeStampInputProps> = (props: DateTimeStampInputProps) => {
    const { name, value, setValue, validationError, required, ...datePickerProps } = props;

    return (
        <DateTimeInput
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

export default DateTimeStampInput;
