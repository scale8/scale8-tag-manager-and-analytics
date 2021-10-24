import { FC } from 'react';
import {
    Box,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControlLabel,
} from '@mui/material';
import { MappedPlatformValuesDisplay } from '../molecules/MappedPlatformValues/MappedPlatformValuesDisplay';
import { MappedPlatformValues } from '../../types/MappedPlatformValuesTypes';
import TextInput from '../atoms/InputTypes/TextInput';
import IntegerInput from '../atoms/InputTypes/IntegerInput';
import { DialogCancelButton } from '../atoms/DialogCancelButton';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

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
    const inputStyle: SxProps<Theme> = {
        width: '100%',
        margin: (theme) => theme.spacing(0, 0, 3),
    };

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
                            sx={inputStyle}
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
                            sx={inputStyle}
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
                            sx={inputStyle}
                            variant="standard"
                            disabled
                        />
                    )}
                    {props.eventDescription && (
                        <Box
                            component="small"
                            sx={{
                                display: 'block',
                                width: '100%',
                                margin: (theme) => theme.spacing(0, 0, 2),
                            }}
                        >
                            {props.eventDescription}
                        </Box>
                    )}
                    <MappedPlatformValuesDisplay
                        mappedPlatformValues={props.platformData}
                        consentPurposes={props.consentPurposes}
                        consentVendors={props.consentVendors}
                        parentLocators={[]}
                    />
                    <FormControlLabel
                        sx={{ display: 'block', width: '100%', marginBottom: 3 }}
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
                            sx={inputStyle}
                            variant="standard"
                            disabled
                        />
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
                <DialogCancelButton onClick={props.handleClose} autoFocus>
                    Close
                </DialogCancelButton>
            </DialogActions>
        </>
    );
};

export default InspectEventDialog;
