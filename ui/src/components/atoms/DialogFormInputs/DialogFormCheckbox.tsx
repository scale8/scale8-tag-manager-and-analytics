import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import ControlledCheckbox from '../ControlledInputs/ControlledCheckbox';

type DialogFormCheckboxProps = {
    name: string;
    label: string;
    realignLeft?: boolean;
    disabled?: boolean;
};

export const DialogFormCheckbox: FC<DialogFormCheckboxProps> = ({
    name,
    label,
    realignLeft,
    disabled,
}) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledCheckbox
            name={name}
            label={label}
            formProps={formProps}
            className="DialogFormField"
            sx={realignLeft ? { marginLeft: '-11px!important' } : {}}
            disabled={disabled}
            color="primary"
        />
    );
};
