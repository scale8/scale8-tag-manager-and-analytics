import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import PositiveInRangeInput from '../InputTypes/PositiveInRangeInput';

type DialogFormPositiveInputProps = {
    name: string;
    label: string;
    max: string;
};

export const DialogFormPositiveInput: FC<DialogFormPositiveInputProps> = ({ name, label, max }) => {
    const formProps = useDialogFormContext();

    return (
        <PositiveInRangeInput
            name={name}
            label={label}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            max={max}
            className="DialogFormField"
        />
    );
};
