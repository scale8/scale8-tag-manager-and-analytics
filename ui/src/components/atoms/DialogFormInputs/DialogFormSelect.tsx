import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import ControlledSelect from '../ControlledInputs/ControlledSelect';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';

type DialogFormControlledSelectProps = {
    name: string;
    label: string;
    values: SelectValueWithSub[];
    resetErrorsOnKeys?: string[];
    disabled?: boolean;
    requiredOnValidation?: boolean;
};

export const DialogFormSelect: FC<DialogFormControlledSelectProps> = ({
    name,
    label,
    values,
    resetErrorsOnKeys,
    disabled,
    requiredOnValidation,
}) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledSelect
            name={name}
            label={label}
            formProps={formProps}
            values={values}
            className="DialogFormField"
            resetErrorsOnKeys={resetErrorsOnKeys}
            disabled={disabled}
            required={!requiredOnValidation}
            requiredOnValidation={requiredOnValidation}
        />
    );
};
