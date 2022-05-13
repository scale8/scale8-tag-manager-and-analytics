import { FC } from 'react';
import ControlledTextInput from '../ControlledInputs/ControlledTextInput';
import { useDialogFormContext } from '../../../context/DialogFormContext';
import { autocompleteOff } from '../../../utils/BrowserUtils';

type DialogFormTextInputProps = {
    name: string;
    label: string;
    autoFocus?: boolean;
    fullWidth?: boolean;
    optional?: boolean;
    password?: boolean;
    newPassword?: boolean;
    disabled?: boolean;
    outlined?: boolean;
    requiredOnValidation?: boolean;
};

export const DialogFormTextInput: FC<DialogFormTextInputProps> = ({
    name,
    label,
    autoFocus,
    fullWidth,
    optional,
    password,
    newPassword,
    disabled,
    outlined,
    requiredOnValidation,
}) => {
    const formProps = useDialogFormContext();

    return (
        <ControlledTextInput
            variant={outlined ? 'outlined' : 'standard'}
            name={name}
            label={label}
            formProps={formProps}
            className="DialogFormField"
            autoFocus={autoFocus}
            fullWidth={fullWidth}
            clearable={!outlined}
            required={!optional && !requiredOnValidation}
            inputProps={
                password
                    ? {
                          autoComplete: 'password',
                      }
                    : newPassword
                    ? {
                          autoComplete: 'new-password',
                      }
                    : {
                          autoComplete: autocompleteOff,
                      }
            }
            type={password || newPassword ? 'password' : 'text'}
            disabled={disabled}
            requiredOnValidation={requiredOnValidation}
        />
    );
};
