import { FC, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import IntegerInput from './IntegerInput';
import FloatInput from './FloatInput';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

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

    const inputStyle: SxProps<Theme> = {
        width: '100%',
        margin: (theme) => theme.spacing(0, 0, 1),
    };

    return (
        <>
            <Box component="label" sx={{ marginTop: 1, fontSize: '0.9em' }}>
                {label}
                {required && contained && ' *'}
            </Box>
            <Box
                sx={{
                    width: '100%',
                    borderRadius: contained ? '4px' : 0,
                    border: contained ? '1px solid #e1e4e8' : 0,
                    padding: (theme) => (contained ? theme.spacing(1) : theme.spacing(1, 0)),
                }}
            >
                {values.map((currentValue, index) => (
                    <Box sx={{ display: 'flex' }} key={index}>
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
                                sx={inputStyle}
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
                                sx={inputStyle}
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
                                sx={inputStyle}
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
                                sx={inputStyle}
                                {...textFieldProps}
                            />
                        )}
                        {!textFieldProps.disabled && (!required || values.length > 1) && (
                            <Box
                                sx={{
                                    flexGrow: 0,
                                    marginLeft: '5px',
                                    marginTop: textFieldProps.size === 'small' ? '6px' : '15px',
                                }}
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
                            </Box>
                        )}
                    </Box>
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
            </Box>
        </>
    );
};

export default ArrayInput;
