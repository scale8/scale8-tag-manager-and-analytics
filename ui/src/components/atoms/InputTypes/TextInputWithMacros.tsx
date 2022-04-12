import { Box, InputAdornment, Popover, TextField } from '@mui/material';
import { ChangeEvent, FC, MouseEvent, useState } from 'react';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import { AppPlatformRevision } from '../../../types/TagRulesTypes';
import { PlatformValueEdit } from '../PlatformValueEdit';
import AdornmentButton from '../AdornamentButton';
import { SmallAddButton } from '../SmallAddButton';
import {
    buildDataContainersSelectValues,
    getAvailableDataContainers,
} from '../../../utils/DataContainersUtils';

export type TextInputWithMacrosProps = TextFieldProps & {
    name: string;
    value: string;
    setValue: (v: string) => void;
    validationError?: string;
    appPlatformRevisions?: AppPlatformRevision[];
};

const TextInputWithMacros: FC<TextInputWithMacrosProps> = (props: TextInputWithMacrosProps) => {
    const {
        name,
        value,
        setValue,
        validationError,
        appPlatformRevisions,
        disabled,
        ...textFieldProps
    } = props;

    const dataContainersSelectValues = buildDataContainersSelectValues(appPlatformRevisions);

    const [requiredError, setRequiredError] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [dataContainerValue, setDataContainerValue] = useState<string>('');

    const open = Boolean(anchorEl);
    const handleClose = () => {
        setDataContainerValue('');
        setAnchorEl(null);
    };

    return (
        <>
            <TextField
                variant="standard"
                value={value}
                onInvalid={(event) => {
                    event.preventDefault();
                    setRequiredError(true);
                }}
                onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                    setRequiredError(false);
                    setValue(event.target.value);
                }}
                name={name}
                error={validationError !== undefined || requiredError}
                helperText={requiredError ? 'Required value' : validationError}
                inputProps={{
                    autoComplete: autocompleteOff,
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AdornmentButton
                                className={open ? 'open' : ''}
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={(event: MouseEvent<any>) => {
                                    setRequiredError(false);
                                    setAnchorEl(event.currentTarget);
                                }}
                                onMouseDown={(event: MouseEvent<HTMLButtonElement>) =>
                                    event.preventDefault()
                                }
                                disabled={props.disabled}
                            >
                                Use Variable
                            </AdornmentButton>
                        </InputAdornment>
                    ),
                }}
                disabled={!!disabled}
                {...textFieldProps}
            />
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: -8,
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box width={250} height={400} p={1} display="flex" flexDirection="column">
                    <Box
                        flex={1}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            '& .DrawerFormField': {
                                width: '100%',
                                margin: (theme) => theme.spacing(0, 0, 3),
                            },
                        }}
                    >
                        <PlatformValueEdit
                            availableDataContainers={getAvailableDataContainers(
                                appPlatformRevisions,
                            )}
                            dataContainersSelectValues={dataContainersSelectValues}
                            value={dataContainerValue}
                            setValue={(v) => setDataContainerValue(v)}
                            disabled={!!disabled}
                        />
                    </Box>
                    <Box textAlign="center">
                        <SmallAddButton
                            addButtonText={dataContainerValue === '' ? 'Cancel' : 'Add'}
                            addButtonClick={() => {
                                setValue(`${value}${dataContainerValue}`);
                                handleClose();
                            }}
                            disabled={props.disabled}
                            hideIcon={dataContainerValue === ''}
                        />
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default TextInputWithMacros;
