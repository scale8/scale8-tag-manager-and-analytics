import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import clsx from 'clsx';
import { CodeInputProps } from '../../../hooks/form/useFormValidation';
import LazyCodeEditor from '../LibraryLoaders/LazyCodeEditor';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
    codeContainer: {
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #bbbbbb',
        backgroundColor: '#f6f6f6',
        padding: '2px',
    },
    lineContainer: {
        display: 'flex',
    },
    closeButtonContainer: {
        marginTop: '15px',
        marginLeft: '5px',
        flexGrow: 0,
    },
    label: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        fontSize: '0.9em',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 1),
    },
    errorContainer: {
        border: '1px solid #ff1744',
    },
    errorLabel: {
        color: '#ff1744',
    },
    errorMessage: {
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
    },
}));

const CodeInput: FC<CodeInputProps> = (props: CodeInputProps) => {
    const classes = useStyles();
    const { name, label, value, mode, setValue, validationError, disabled, required } = props;

    return (
        <div className={classes.root}>
            <label className={clsx(classes.label, validationError && classes.errorLabel)}>
                {label}
                {required && ' *'}{' '}
                <Box component="span" color="#aaaaaa">
                    ( {mode === 'javascript' ? 'JS' : mode.toUpperCase()} )
                </Box>
            </label>
            <div className={clsx(classes.codeContainer, validationError && classes.errorContainer)}>
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
            </div>
            <p className={classes.errorMessage}>{validationError}</p>
        </div>
    );
};

export default CodeInput;
