import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import ControlledIntegerInput from '../ControlledInputs/ControlledIntegerInput';

type DialogFormIntegerInputProps = {
    name: string;
    label: string;
    autoFocus?: boolean;
};

export const DialogFormIntegerInput: FC<DialogFormIntegerInputProps> = ({
    name,
    label,
    autoFocus,
}) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledIntegerInput
            name={name}
            label={label}
            formProps={formProps}
            autoFocus={autoFocus}
            className="DialogFormField"
            required
        />
    );
};
