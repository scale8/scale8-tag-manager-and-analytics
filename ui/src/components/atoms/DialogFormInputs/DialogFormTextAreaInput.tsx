import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import ControlledTextAreaInput from '../ControlledInputs/ControlledTextAreaInput';

type DialogFormTextAreaInputProps = {
    name: string;
    label: string;
    optional?: boolean;
    maxRows?: number;
    disabled?: boolean;
    requiredOnValidation?: boolean;
};

export const DialogFormTextAreaInput: FC<DialogFormTextAreaInputProps> = ({
    name,
    label,
    optional,
    maxRows,
    disabled,
    requiredOnValidation,
}) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledTextAreaInput
            name={name}
            label={label}
            formProps={formProps}
            className="DialogFormField"
            required={!optional && !requiredOnValidation}
            maxRows={maxRows}
            disabled={disabled}
            requiredOnValidation={requiredOnValidation}
        />
    );
};
