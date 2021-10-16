import { FC } from 'react';
import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControlLabel,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { grey } from '@mui/material/colors';
import { MappedPlatformValuesDisplay } from '../molecules/MappedPlatformValues/MappedPlatformValuesDisplay';
import { MappedPlatformValues } from '../../types/MappedPlatformValuesTypes';
import TextInput from '../atoms/InputTypes/TextInput';
import IntegerInput from '../atoms/InputTypes/IntegerInput';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2, 1, 2),
        },
        dialogActions: {
            padding: theme.spacing(2),
            justifyContent: 'center',
        },
        input: {
            width: '100%',
            margin: theme.spacing(0, 0, 3),
        },
        checkbox: {
            display: 'block',
            width: '100%',
            marginBottom: theme.spacing(3),
        },
        cancel: {
            color: theme.palette.getContrastText(grey[900]),
            backgroundColor: grey[700],
            '&:hover': {
                backgroundColor: grey[900],
            },
        },
        description: {
            display: 'block',
            width: '100%',
            margin: theme.spacing(0, 0, 2),
        },
    }),
);

type InspectEventDialogContentProps = {
    platformData: MappedPlatformValues;
    name: string;
    clearState: number;
    customEvent?: string;
    platform?: string;
    event?: string;
    eventDescription?: string;
    consentPurposes: { id: number; name: string }[];
    consentVendors: { id: number; name: string }[];
    handleClose: () => void;
};

const InspectEventDialog: FC<InspectEventDialogContentProps> = (
    props: InspectEventDialogContentProps,
) => {
    const classes = useStyles();

    return (
        <>
            <DialogContent>
                <Box fontSize="h6.fontSize" minWidth={520} mb={2}>
                    {props.name}
                </Box>
                <DialogContentText component="div" id="alert-dialog-description">
                    {props.customEvent && (
                        <TextInput
                            name="custom-event"
                            label="Custom Event"
                            value={props.customEvent}
                            setValue={() => {
                                // disabled
                            }}
                            className={classes.input}
                            variant="standard"
                            disabled
                        />
                    )}
                    {props.platform && (
                        <TextInput
                            name="platform"
                            label="Platform"
                            value={props.platform}
                            setValue={() => {
                                // disabled
                            }}
                            className={classes.input}
                            variant="standard"
                            disabled
                        />
                    )}
                    {props.event && (
                        <TextInput
                            name="event"
                            label="Event"
                            value={props.event}
                            setValue={() => {
                                // disabled
                            }}
                            className={classes.input}
                            variant="standard"
                            disabled
                        />
                    )}
                    {props.eventDescription && (
                        <small className={classes.description}>{props.eventDescription}</small>
                    )}
                    <MappedPlatformValuesDisplay
                        mappedPlatformValues={props.platformData}
                        consentPurposes={props.consentPurposes}
                        consentVendors={props.consentVendors}
                        parentLocators={[]}
                    />
                    <FormControlLabel
                        className={classes.checkbox}
                        control={
                            <Checkbox
                                name="useClearState"
                                checked={props.clearState !== -1}
                                onChange={() => {
                                    // disabled
                                }}
                                color="primary"
                                disabled
                            />
                        }
                        label="Use timer to reset event state"
                    />
                    {props.clearState !== -1 && (
                        <IntegerInput
                            name="clearState"
                            label="Reset event state after (milliseconds)"
                            value={props.clearState}
                            setValue={() => {
                                // disabled
                            }}
                            className={classes.input}
                            variant="standard"
                            disabled
                        />
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button onClick={props.handleClose} className={classes.cancel} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </>
    );
};

export default InspectEventDialog;
