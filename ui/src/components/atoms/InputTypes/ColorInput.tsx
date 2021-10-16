import { FC, MouseEvent, useState } from 'react';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { Box, IconButton, InputAdornment, Popover, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import LazyColorPicker from '../LibraryLoaders/LazyColorPicker';

export type ColorInputProps = Omit<TextFieldProps, 'onChange' | 'defaultValue'> & {
    name: string;
    value: string;
    setValue: (v: string) => void;
    validationError?: string;
};

const ColorInput: FC<ColorInputProps> = (props: ColorInputProps) => {
    const { name, value, setValue, validationError, required, disabled, ...textFieldProps } = props;

    const [requiredError, setRequiredError] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div>
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <div
                                    style={{
                                        height: '22px',
                                        width: '22px',
                                        border: value === '' ? 'none' : '1px solid #555555',
                                        backgroundColor: value === '' ? 'transparent' : value,
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    value={value}
                    onInvalid={(event) => {
                        event.preventDefault();
                        setRequiredError(true);
                    }}
                    onClick={(event: MouseEvent<HTMLDivElement>) => {
                        if (disabled) return;
                        setRequiredError(false);
                        setAnchorEl(event.currentTarget);
                    }}
                    name={name}
                    error={validationError !== undefined || requiredError}
                    helperText={requiredError ? 'Required value' : validationError}
                    inputProps={{
                        autoComplete: autocompleteOff,
                    }}
                    disabled={disabled}
                    {...textFieldProps}
                />
                {!required && !disabled && (
                    <Box display="inline-box" position="relative">
                        <IconButton
                            style={{
                                marginLeft: -25,
                                marginTop: 0,
                                position: 'absolute',
                            }}
                            aria-label="empty"
                            onClick={() => {
                                setValue('');
                            }}
                            size="small"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <LazyColorPicker value={value} setValue={setValue} />
            </Popover>
        </>
    );
};

export default ColorInput;
