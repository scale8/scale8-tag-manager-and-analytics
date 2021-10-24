import { FC, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import TextInput from './InputTypes/TextInput';
import { PlatformDataMapValidation } from '../../types/DataMapsTypes';
import SelectInput from './InputTypes/SelectInput';
import { ValidationType } from '../../gql/generated/globalTypes';
import IntegerInput from './InputTypes/IntegerInput';

export type ValidationInputProps = Omit<TextFieldProps, 'value'> & {
    name: string;
    label?: string;
    values: PlatformDataMapValidation[];
    types: { key: string; text: string }[];
    setValue: (v: PlatformDataMapValidation, index: number) => void;
    errors?: Map<number, string>;
    removeArrayElement: (index: number) => void;
    addArrayElement: () => void;
    contained: boolean;
    required?: boolean;
};

const ValidationRulesInput: FC<ValidationInputProps> = (props: ValidationInputProps) => {
    const {
        name,
        label,
        types,
        values,
        setValue,
        errors,
        removeArrayElement,
        addArrayElement,
        required,
        contained,
        ...textFieldProps
    } = props;

    useEffect(() => {
        if (required && values.length === 0) {
            addArrayElement();
        }
    }, [values, required, addArrayElement]);

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
                    padding: (theme) => (contained ? undefined : theme.spacing(1, 0)),
                }}
            >
                {values.map((currentValue, index) => (
                    <Box sx={{ display: 'flex', marginBottom: '8px' }} key={index}>
                        <Box
                            flexGrow={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            borderBottom="1px solid #e1e4e8"
                            p={1}
                        >
                            <Box flexGrow={1} display="flex" flexDirection="column">
                                <Box mb={1}>
                                    <SelectInput
                                        name={`${name}-type-${index}`}
                                        value={currentValue.type}
                                        setValue={(v) => {
                                            setValue(
                                                {
                                                    input_value: null,
                                                    type: v as ValidationType,
                                                },
                                                index,
                                            );
                                        }}
                                        optionValues={[]}
                                        keyTextValues={types}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        disabled={textFieldProps.disabled}
                                        required
                                    />
                                </Box>
                                <Box flexGrow={1}>
                                    {currentValue.type === ValidationType.VALID_REGEX ? (
                                        <TextInput
                                            fullWidth
                                            name={`${name}-${index}`}
                                            value={
                                                currentValue.input_value === null
                                                    ? ''
                                                    : (currentValue.input_value as string)
                                            }
                                            setValue={(v) => {
                                                setValue(
                                                    {
                                                        input_value: v,
                                                        type: currentValue.type,
                                                    },
                                                    index,
                                                );
                                            }}
                                            validationError={
                                                errors !== undefined && errors.has(index)
                                                    ? errors.get(index)
                                                    : undefined
                                            }
                                            variant="outlined"
                                            size="small"
                                            disabled={textFieldProps.disabled}
                                            required
                                        />
                                    ) : (
                                        <IntegerInput
                                            fullWidth
                                            name={`${name}-${index}`}
                                            value={
                                                currentValue.input_value === null
                                                    ? ''
                                                    : (currentValue.input_value as number)
                                            }
                                            setValue={(v) => {
                                                setValue(
                                                    {
                                                        input_value: v === '' ? null : v,
                                                        type: currentValue.type,
                                                    },
                                                    index,
                                                );
                                            }}
                                            validationError={
                                                errors !== undefined && errors.has(index)
                                                    ? errors.get(index)
                                                    : undefined
                                            }
                                            variant="outlined"
                                            size="small"
                                            disabled={textFieldProps.disabled}
                                            required
                                        />
                                    )}
                                </Box>
                            </Box>
                            {!textFieldProps.disabled && (!required || values.length > 1) && (
                                <Box pl={1} flexGrow={0}>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => {
                                            removeArrayElement(index);
                                        }}
                                        size="small"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
                {!textFieldProps.disabled && (
                    <Box p={1}>
                        <IconButton
                            aria-label="add"
                            onClick={() => {
                                addArrayElement();
                            }}
                            size="small"
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default ValidationRulesInput;
