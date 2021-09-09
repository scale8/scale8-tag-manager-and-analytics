import { FC } from 'react';
import { Box, Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { MappedPlatformValuesDisplay } from '../molecules/MappedPlatformValues/MappedPlatformValuesDisplay';
import { MappedPlatformValues } from '../../types/MappedPlatformValuesTypes';
import { AppPlatformRevision } from '../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../types/IngestEndpointsTypes';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: theme.spacing(0, 2, 1, 2),
        },
        dialogActions: {
            padding: theme.spacing(2),
            justifyContent: 'center',
        },
        cancel: {
            color: theme.palette.getContrastText(grey[900]),
            backgroundColor: grey[700],
            '&:hover': {
                backgroundColor: grey[900],
            },
        },
    }),
);

type InspectDialogContentProps = {
    appPlatformRevisions?: AppPlatformRevision[];
    ingestEndpoints: IngestEndpointForEnvironmentSelection[];
    environments: { id: string; name: string }[];
    revisions: { id: string; name: string }[];
    consentPurposes: { id: number; name: string }[];
    consentVendors: { id: number; name: string }[];
    platformData: MappedPlatformValues;
    name: string;
    handleClose: () => void;
};

const InspectActionDialog: FC<InspectDialogContentProps> = (props: InspectDialogContentProps) => {
    const classes = useStyles();

    return (
        <>
            <DialogContent>
                <Box fontSize="h6.fontSize" minWidth={520} mb={2}>
                    {props.name}
                </Box>
                <DialogContentText component="div" id="alert-dialog-description">
                    <MappedPlatformValuesDisplay
                        appPlatformRevisions={props.appPlatformRevisions}
                        ingestEndpoints={props.ingestEndpoints}
                        revisions={props.revisions}
                        environments={props.environments}
                        consentPurposes={props.consentPurposes}
                        consentVendors={props.consentVendors}
                        mappedPlatformValues={props.platformData}
                        parentLocators={[]}
                    />
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

export default InspectActionDialog;
