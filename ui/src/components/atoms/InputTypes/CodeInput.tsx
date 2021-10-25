import { FC } from 'react';
import { Box } from '@mui/material';
import { CodeInputProps } from '../../../hooks/form/useFormValidation';
import LazyCodeEditor from '../LibraryLoaders/LazyCodeEditor';

const CodeInput: FC<CodeInputProps> = (props: CodeInputProps) => {
    const { name, label, value, mode, setValue, validationError, disabled, required } = props;

    return (
        <Box sx={{ width: '100%', margin: (theme) => theme.spacing(0, 0, 3) }}>
            <Box
                component="label"
                sx={{
                    color: validationError ? '#ff1744' : undefined,
                    marginLeft: (theme) => theme.spacing(1),
                    marginTop: (theme) => theme.spacing(1),
                    fontSize: '0.9em',
                }}
            >
                {label}
                {required && ' *'}{' '}
                <Box component="span" color="#aaaaaa">
                    ( {mode === 'javascript' ? 'JS' : mode.toUpperCase()} )
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    borderRadius: '5px',
                    border: validationError ? '1px solid #ff1744' : '1px solid #bbbbbb',
                    backgroundColor: '#f6f6f6',
                    padding: '2px',
                }}
            >
                <LazyCodeEditor
                    onBlur={props.onBlur}
                    value={value}
                    onChange={(value) => {
                        setValue(value);
                    }}
                    mode={mode}
                    theme="tomorrow"
                    name={name}
                    readOnly={disabled}
                    minLines={5}
                    maxLines={100}
                    width="100%"
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 4,
                        useWorker: false,
                    }}
                />
            </Box>
            <Box
                component="p"
                sx={{
                    marginLeft: '14px',
                    marginRight: '14px',
                    color: '#ff1744',
                    margin: 0,
                    fontSize: '0.75rem',
                    marginTop: '3px',
                    textAlign: 'left',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    lineHeight: '1.66',
                    letterSpacing: '0.03333em',
                    fontWeight: 400,
                }}
            >
                {validationError}
            </Box>
        </Box>
    );
};

export default CodeInput;
