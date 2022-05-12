import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import ControlledBooleanSelect from '../ControlledInputs/ControlledBooleanSelect';

type DialogFormBooleanSelectProps = {
    name: string;
    label: string;
};

export const DialogFormBooleanSelect: FC<DialogFormBooleanSelectProps> = ({ name, label }) => {
    const formProps = useDialogFormContext();

    return <ControlledBooleanSelect name={name} label={label} formProps={formProps} required />;
};
