import { FC } from 'react';
import { Box, DialogContent, DialogContentText } from '@mui/material';
import { InfoButton, InfoProps } from '../molecules/InfoButton';
import InfoDialogTitle from '../molecules/InfoDialogTitle';
import EnvironmentInstallInstructions from './EnvironmentInstallInstructions';
import { Mode } from '../../gql/generated/globalTypes';

export type InstallInstructionsDialogProps = {
    handleDialogClose: (checkChanges: boolean) => void;
    installDomain: string;
    title: string;
    formInfoProps?: InfoProps;
    cname: string;
    environmentName: string;
    environmentId: string;
    mode: Mode;
    tags: { name: string; code: string; type: string }[];
};

const EnvironmentInstallInstructionsDialog: FC<InstallInstructionsDialogProps> = (
    props: InstallInstructionsDialogProps,
) => {
    return (
        <>
            <InfoDialogTitle handleDialogClose={props.handleDialogClose}>
                {props.title}
                {props.formInfoProps !== undefined && <InfoButton {...props.formInfoProps} />}
            </InfoDialogTitle>
            <DialogContent sx={{ margin: 0, padding: 0 }} dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '700px' }}>
                    <DialogContent>
                        <DialogContentText component="div" id="alert-dialog-description">
                            <EnvironmentInstallInstructions {...props} />
                        </DialogContentText>
                    </DialogContent>
                </Box>
            </DialogContent>
        </>
    );
};

export default EnvironmentInstallInstructionsDialog;
