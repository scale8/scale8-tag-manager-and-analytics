import { FC } from 'react';
import ControlledTextInput from '../ControlledInputs/ControlledTextInput';
import { useDialogFormContext } from '../../../context/DialogFormContext';

type DialogFormTextInputProps = {
    name: string;
    label: string;
};

export const DialogFormTextInput: FC<DialogFormTextInputProps> = ({ name, label }) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledTextInput
            name={name}
            label={label}
            formProps={formProps}
            className="DialogFormField"
            required
        />
    );
};
