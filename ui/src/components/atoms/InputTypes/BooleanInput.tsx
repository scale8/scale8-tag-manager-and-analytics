import { FC } from 'react';
import { FormControlProps } from '@mui/material';
import SelectInput from './SelectInput';

export type BooleanInputProps = Omit<FormControlProps, 'children'> & {
    name: string;
    value: boolean | '';
    label?: string;
    setValue: (v: boolean | '') => void;
    validationError?: string;
};

const BooleanInput: FC<BooleanInputProps> = (props: BooleanInputProps) => {
    const { value, setValue, ...selectProps } = props;

    return (
        <SelectInput
            value={value === '' ? '' : value ? 'True' : 'False'}
            setValue={(v) => setValue(v === '' ? '' : v === 'True')}
            optionValues={['True', 'False']}
            {...selectProps}
        />
    );
};

export default BooleanInput;
