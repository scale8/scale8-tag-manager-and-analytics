import { FC } from 'react';
import { Box, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { MappedPlatformValuesDisplay } from '../molecules/MappedPlatformValues/MappedPlatformValuesDisplay';
import { MappedPlatformValues } from '../../types/MappedPlatformValuesTypes';
import { AppPlatformRevision } from '../../types/TagRulesTypes';
import { IngestEndpointForEnvironmentSelection } from '../../types/IngestEndpointsTypes';
import { DialogCancelButton } from '../atoms/DialogCancelButton';

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
            <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
                <DialogCancelButton onClick={props.handleClose} autoFocus>
                    Close
                </DialogCancelButton>
            </DialogActions>
        </>
    );
};

export default InspectActionDialog;
