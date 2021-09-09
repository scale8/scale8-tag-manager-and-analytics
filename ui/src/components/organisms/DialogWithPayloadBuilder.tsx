import { Dispatch, FC, PropsWithChildren, SetStateAction, useState } from 'react';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    IconButton,
    Step,
    StepLabel,
    Stepper,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DataMapsPayload, DataMapsPayloadBuilder } from './DataMapsPayloadBuilder';
import CloseIcon from '@material-ui/icons/Close';
import { DataMapsPayloadValues } from '../../types/DataMapsTypes';
import { IngestEndpointDataMap } from '../../types/IngestEndpointsTypes';

const useStyles = makeStyles((theme) =>
    createStyles({
        header: {
            minWidth: '700px',
            flexShrink: 0,
            borderBottom: '1px solid #dddddd',
        },
        footer: {
            borderTop: '1px solid #dddddd',
            flexShrink: 0,
            minHeight: '51px',
            padding: theme.spacing(1),
            justifyContent: 'center',
        },
        content: {
            flexGrow: 1,
            overflow: 'auto',
            minHeight: '2em',
        },
        stepper: {
            padding: theme.spacing(2),
            width: '550px',
        },
        closeButton: {
            position: 'absolute',
            right: '11px',
            top: '11px',
            color: theme.palette.grey[700],
        },
    }),
);

export type DialogWithPayloadBuilderProps = {
    dataMaps: IngestEndpointDataMap[];
    setPayload: Dispatch<SetStateAction<DataMapsPayload>>;
    handleDialogClose: (checkChanges: boolean) => void;
    payload: DataMapsPayload;
    finalStepLabel: string;
};

const DialogWithPayloadBuilder: FC<DialogWithPayloadBuilderProps> = (
    props: PropsWithChildren<DialogWithPayloadBuilderProps>,
) => {
    const classes = useStyles();

    const { handleDialogClose, children, payload, ...payloadBuilderProps } = props;

    const [activeStep, setActiveStep] = useState(0);

    const [dataMapsPayloadValues, setDataMapsPayloadValues] = useState<DataMapsPayloadValues[]>([]);

    const steps = ['Prepare Values', props.finalStepLabel];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <div className={classes.header}>
                <Stepper className={classes.stepper} activeStep={activeStep}>
                    {steps.map((label) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <IconButton
                    size="small"
                    onClick={() => handleDialogClose(true)}
                    className={classes.closeButton}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <DialogContent className={classes.content}>
                <Box display={activeStep === 0 ? 'block' : 'none'}>
                    <DataMapsPayloadBuilder
                        {...payloadBuilderProps}
                        initialPayload={null}
                        dataMapsPayloadValues={dataMapsPayloadValues}
                        setDataMapsPayloadValues={setDataMapsPayloadValues}
                        disabled={false}
                    />
                </Box>
                {activeStep > 0 && children}
            </DialogContent>
            <DialogActions className={classes.footer}>
                {payload === null ? (
                    <Box fontWeight={600} mb="3px">
                        Please specify all the checked values
                    </Box>
                ) : (
                    <>
                        <Button size="small" disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                        <Button size="small" disabled={activeStep === 1} onClick={handleNext}>
                            Next
                        </Button>
                    </>
                )}
            </DialogActions>
        </>
    );
};

export default DialogWithPayloadBuilder;
