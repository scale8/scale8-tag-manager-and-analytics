import { FC } from 'react';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';
import ControlledFilteredSelects from '../ControlledInputs/ControlledFilteredSelects';

type DialogFormControlledFilteredSelectsProps = {
    name: string;
    label: string;
    values: SelectValueWithSub[];
    filterLabel: string;
    initialFilterValue?: string;
    missingSubMessage: string;
    disabled?: boolean;
    showNoSub?: boolean;
};

export const DialogFormFilteredSelects: FC<DialogFormControlledFilteredSelectsProps> = ({
    name,
    label,
    values,
    filterLabel,
    initialFilterValue,
    missingSubMessage,
    disabled,
    showNoSub,
}) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledFilteredSelects
            name={name}
            label={label}
            initialFilterValue={initialFilterValue}
            values={values}
            filterLabel={filterLabel}
            missingSubMessage={missingSubMessage}
            formProps={formProps}
            className="DialogFormField"
            disabled={disabled}
            hideNoSub={!showNoSub}
            required
        />
    );
};
