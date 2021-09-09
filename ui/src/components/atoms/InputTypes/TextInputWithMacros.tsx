import { Box, Button, InputAdornment, Popover, TextField } from '@material-ui/core';
import { ChangeEvent, FC, MouseEvent, useState } from 'react';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { autocompleteOff } from '../../../utils/BrowserUtils';
import { AppPlatformRevision } from '../../../types/TagRulesTypes';
import { PlatformValueEdit } from '../PlatformValueEdit';
import { buildDataContainersFilteredPlatforms } from '../../../utils/DataContainersUtils';
import { DataContainersFilteredPlatform } from '../../molecules/DataMapsValueEdit';
import AddIcon from '@material-ui/icons/Add';
import AdornmentButton from '../AdornamentButton';
import { VarType } from '../../../gql/generated/globalTypes';

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

    const dataContainersFilteredPlatforms: DataContainersFilteredPlatform[] =
        buildDataContainersFilteredPlatforms(appPlatformRevisions, VarType.STRING, true);

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
                <Box width={250} height={330} p={1} display="flex" flexDirection="column">
                    <Box flex={1}>
                        <PlatformValueEdit
                            dataContainersFilteredPlatforms={dataContainersFilteredPlatforms}
                            value={dataContainerValue}
                            setValue={(v) => setDataContainerValue(v)}
                            disabled={!!disabled}
                        />
                    </Box>
                    <Box textAlign="center">
                        <Button
                            size="small"
                            color="default"
                            variant="outlined"
                            onClick={() => {
                                setValue(`${value}${dataContainerValue}`);
                                handleClose();
                            }}
                            startIcon={dataContainerValue !== '' ? <AddIcon /> : null}
                            disabled={props.disabled}
                        >
                            {dataContainerValue === '' ? 'Cancel' : 'Add'}
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default TextInputWithMacros;
