import { ChangeEvent, ReactElement, useState } from 'react';
import { Box, Divider, Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { EnvironmentVariablesInputProps } from '../../types/props/EnvironmentVariablesInputProps';

const EnvironmentVariablesInput = (props: EnvironmentVariablesInputProps): ReactElement => {
    const { values, label } = props;
    const [currentKey, setCurrentKey] = useState('');
    const [currentValue, setCurrentValue] = useState('');

    return (
        <>
            <Box
                component="label"
                sx={{ marginTop: (theme) => theme.spacing(1), fontSize: '0.9em' }}
            >
                {label}
            </Box>
            <Box sx={{ width: '100%', borderRadius: '4px', border: '1px solid #e1e4e8' }}>
                <Box
                    sx={{
                        minHeight: (theme) => theme.spacing(2),
                        padding: (theme) => theme.spacing(1),
                    }}
                >
                    {values.length === 0 && (
                        <Box m={1} textAlign="center">
                            <small>No environment variables</small>
                        </Box>
                    )}
                    {values.map((currentVariable, index) => (
                        <Grid container alignItems="center" key={index}>
                            <Grid item xs>
                                {currentVariable.key} = {currentVariable.value}
                            </Grid>
                            <Grid item>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                        props.remove(currentVariable.key);
                                    }}
                                    size="small"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                </Box>
                <Divider />
                <Grid
                    container
                    alignItems="center"
                    sx={{
                        minHeight: (theme) => theme.spacing(2),
                        padding: (theme) => theme.spacing(1),
                    }}
                >
                    <Grid item xs>
                        <TextField
                            label="Key"
                            value={currentKey}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                            ) => {
                                setCurrentKey(
                                    event.target.value.toUpperCase().replace(/[^A-Z_]+/g, ''),
                                );
                            }}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        <Box px={1}>=</Box>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            label="Value"
                            value={currentValue}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                            ) => {
                                setCurrentValue(event.target.value);
                            }}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        <IconButton
                            aria-label="add"
                            onClick={() => {
                                props.add(currentKey, currentValue);
                                setCurrentKey('');
                                setCurrentValue('');
                            }}
                            size="small"
                            disabled={currentKey === '' || currentValue === ''}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default EnvironmentVariablesInput;
