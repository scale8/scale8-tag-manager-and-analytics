import { makeStyles } from '@material-ui/core/styles';
import { FC, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import IntegerInput from './IntegerInput';
import FloatInput from './FloatInput';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    arrayContainer: {
        width: '100%',
        borderRadius: '4px',
        border: '1px solid #e1e4e8',
        padding: theme.spacing(1),
    },
    arrayContainerUnContained: {
        width: '100%',
        borderRadius: 0,
        border: 0,
        padding: theme.spacing(1, 0),
    },
    lineContainer: {
        display: 'flex',
    },
    closeButtonContainer: {
        marginTop: '15px',
        marginLeft: '5px',
        flexGrow: 0,
    },
    closeButtonContainerSmallInput: {
        marginTop: '6px',
        marginLeft: '5px',
        flexGrow: 0,
    },
    label: {
        marginTop: theme.spacing(1),
        fontSize: '0.9em',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 1),
    },
}));

export type ArrayInputProps = Omit<TextFieldProps, 'value'> & {
    name: string;
    label?: string;
    values: S8DataMapValue[];
    setValue: (v: S8DataMapValue, index: number) => void;
    errors?: Map<number, string>;
    removeArrayElement: (dataMapId: string, index: number) => void;
    addArrayElement: (dataMapId: string) => void;
    arrayType: 'int' | 'float' | 'text' | 'textarea';
    contained: boolean;
    required?: boolean;
};

const ArrayInput: FC<ArrayInputProps> = (props: ArrayInputProps) => {
    const classes = useStyles();
    const {
        name,
        label,
        values,
        setValue,
        errors,
        removeArrayElement,
        addArrayElement,
        arrayType,
        required,
        contained,
        ...textFieldProps
    } = props;

    useEffect(() => {
        if (required && values.length === 0) {
            addArrayElement(name);
        }
    }, [values, required, addArrayElement, name]);

    return (
        <>
            <label className={classes.label}>
                {label}
                {required && contained && ' *'}
            </label>
            <div
                className={clsx(
                    contained ? classes.arrayContainer : classes.arrayContainerUnContained,
                )}
            >
                {values.map((currentValue, index) => (
                    <div className={classes.lineContainer} key={index}>
                        {arrayType === 'int' && (
                            <IntegerInput
                                name={`${name}-${index}`}
                                value={
                                    Number.isInteger(currentValue) ? (currentValue as number) : ''
                                }
                                setValue={(v) => setValue(v, index)}
                                validationError={
                                    errors !== undefined && errors.has(index)
                                        ? errors.get(index)
                                        : undefined
                                }
                                variant="outlined"
                                required
                                className={classes.input}
                                {...textFieldProps}
                            />
                        )}
                        {arrayType === 'float' && (
                            <FloatInput
                                name={`${name}-${index}`}
                                value={
                                    isNaN(parseFloat(currentValue.toString()))
                                        ? ''
                                        : (currentValue as number)
                                }
                                setValue={(v) => setValue(v, index)}
                                validationError={
                                    errors !== undefined && errors.has(index)
                                        ? errors.get(index)
                                        : undefined
                                }
                                variant="outlined"
                                required
                                className={classes.input}
                                {...textFieldProps}
                            />
                        )}
                        {arrayType === 'text' && (
                            <TextInput
                                name={`${name}-${index}`}
                                value={currentValue.toString()}
                                setValue={(v) => setValue(v, index)}
                                validationError={
                                    errors !== undefined && errors.has(index)
                                        ? errors.get(index)
                                        : undefined
                                }
                                variant="outlined"
                                required
                                className={classes.input}
                                {...textFieldProps}
                            />
                        )}
                        {arrayType === 'textarea' && (
                            <TextAreaInput
                                name={`${name}-${index}`}
                                value={currentValue.toString()}
                                setValue={(v) => setValue(v, index)}
                                validationError={
                                    errors !== undefined && errors.has(index)
                                        ? errors.get(index)
                                        : undefined
                                }
                                required
                                className={classes.input}
                                {...textFieldProps}
                            />
                        )}
                        {!textFieldProps.disabled && (!required || values.length > 1) && (
                            <div
                                className={clsx(
                                    textFieldProps.size === 'small'
                                        ? classes.closeButtonContainerSmallInput
                                        : classes.closeButtonContainer,
                                )}
                            >
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                        removeArrayElement(name, index);
                                    }}
                                    size="small"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </div>
                        )}
                    </div>
                ))}
                {!textFieldProps.disabled && (
                    <IconButton
                        aria-label="add"
                        onClick={() => {
                            addArrayElement(name);
                        }}
                        size="small"
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                )}
            </div>
        </>
    );
};

export default ArrayInput;
