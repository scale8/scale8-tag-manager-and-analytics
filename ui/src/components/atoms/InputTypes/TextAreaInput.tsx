import { FC } from 'react';
import TextInput, { TextInputProps } from './TextInput';
import { autocompleteOff } from '../../../utils/BrowserUtils';

const TextAreaInput: FC<TextInputProps> = (props: TextInputProps) => {
    return (
        <TextInput
            minRows={3}
            maxRows={20}
            multiline
            inputProps={{
                autoComplete: autocompleteOff,
            }}
            variant="outlined"
            {...props}
        />
    );
};

export default TextAreaInput;
