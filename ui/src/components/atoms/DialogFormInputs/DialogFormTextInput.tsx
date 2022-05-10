import { FC } from 'react';
import ControlledTextInput from '../ControlledInputs/ControlledTextInput';
import { useDialogFormContext } from '../../../context/DialogFormContext';

type DialogFormTextInputProps = {
    name: string;
    label: string;
    autoFocus?: boolean;
};

export const DialogFormTextInput: FC<DialogFormTextInputProps> = ({ name, label, autoFocus }) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledTextInput
            name={name}
            label={label}
            formProps={formProps}
            className="DialogFormField"
            autoFocus={autoFocus}
            required
        />
    );
};
