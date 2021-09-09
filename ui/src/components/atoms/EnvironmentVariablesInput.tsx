import { makeStyles } from '@material-ui/core/styles';
import { ChangeEvent, ReactElement, useState } from 'react';
import { Box, Divider, Grid, IconButton, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { EnvironmentVariablesInputProps } from '../../types/props/EnvironmentVariablesInputProps';

const useStyles = makeStyles((theme) => ({
    arrayContainer: {
        width: '100%',
        borderRadius: '4px',
        border: '1px solid #e1e4e8',
    },
    sectionContainer: {
        minHeight: theme.spacing(2),
        padding: theme.spacing(1),
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

const EnvironmentVariablesInput = <T extends { [key: string]: any }>(
    props: EnvironmentVariablesInputProps,
): ReactElement => {
    const classes = useStyles();
    const { values, label } = props;
    const [currentKey, setCurrentKey] = useState('');
    const [currentValue, setCurrentValue] = useState('');

    return (
        <>
            <label className={classes.label}>{label}</label>
            <div className={classes.arrayContainer}>
                <div className={classes.sectionContainer}>
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
                </div>
                <Divider />
                <Grid container alignItems="center" className={classes.sectionContainer}>
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
            </div>
        </>
    );
};

export default EnvironmentVariablesInput;
