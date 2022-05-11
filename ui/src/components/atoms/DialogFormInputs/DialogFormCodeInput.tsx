import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import ControlledCodeInput from '../ControlledInputs/ControlledCodeInput';
import { BaseCodeInputProps } from '../../../hooks/form/useFormValidation';

type DialogFormCodeInputProps = {
    name: string;
    label: string;
    mode: BaseCodeInputProps['mode'];
};

export const DialogFormCodeInput: FC<DialogFormCodeInputProps> = ({ name, label, mode }) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledCodeInput name={name} label={label} mode={mode} formProps={formProps} required />
    );
};
