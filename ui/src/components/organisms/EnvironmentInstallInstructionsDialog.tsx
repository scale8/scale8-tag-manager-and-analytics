import { FC } from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { InfoButton, InfoProps } from '../molecules/InfoButton';
import InfoDialogTitle from '../molecules/InfoDialogTitle';
import EnvironmentInstallInstructions from './EnvironmentInstallInstructions';
import { Mode } from '../../gql/generated/globalTypes';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '700px',
        },
    }),
);

export type InstallInstructionsDialogProps = {
    handleDialogClose: (checkChanges: boolean) => void;
    installDomain: string;
    title: string;
    formInfoProps?: InfoProps;
    customDomain: string | null;
    cname: string;
    environmentName: string;
    environmentId: string;
    mode: Mode;
    tags: { name: string; code: string; type: string }[];
};

const EnvironmentInstallInstructionsDialog: FC<InstallInstructionsDialogProps> = (
    props: InstallInstructionsDialogProps,
) => {
    const classes = useStyles();

    return (
        <>
            <InfoDialogTitle handleDialogClose={props.handleDialogClose}>
                {props.title}
                {props.formInfoProps !== undefined && <InfoButton {...props.formInfoProps} />}
            </InfoDialogTitle>
            <DialogContent
                style={{
                    margin: 0,
                    padding: 0,
                }}
                dividers
            >
                <div className={classes.root}>
                    <DialogContent>
                        <DialogContentText component="div" id="alert-dialog-description">
                            <EnvironmentInstallInstructions {...props} />
                        </DialogContentText>
                    </DialogContent>
                </div>
            </DialogContent>
        </>
    );
};

export default EnvironmentInstallInstructionsDialog;
