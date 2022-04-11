import { ReactElement } from 'react';
import { ControlledGenericStringInputProps } from '../../../hooks/form/useFormValidation';
import DomSelectorInput from '../InputTypes/DomSelectorInput';

const ControlledDomSelectorInput = <T extends { [key: string]: any }>(
    props: ControlledGenericStringInputProps<T>,
): ReactElement => {
    const { name, formProps, disabled, ...inputProps } = props;

    const buildInitialSelector = (): 'ID' | 'Class Name' | 'Custom' => {
        if (formProps.values[name].charAt(0) === '.') {
            return 'Class Name';
        } else if (formProps.values[name].charAt(0) === '#') {
            return 'ID';
        } else {
            return 'Custom';
        }
    };

    return (
        <DomSelectorInput
            name={name}
            initialSelector={buildInitialSelector()}
            value={formProps.values[name]}
            setValue={(v) => formProps.handleChange(name, v)}
            validationError={formProps.errors[name]}
            onBlur={formProps.handleBlur}
            disabled={!!disabled}
            {...inputProps}
        />
    );
};

export default ControlledDomSelectorInput;
