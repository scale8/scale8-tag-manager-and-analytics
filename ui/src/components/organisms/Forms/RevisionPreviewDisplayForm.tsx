import { FC, FormEvent } from 'react';
import { Box, DialogContent, DialogContentText } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import qrcode from 'qrcode.react';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
            minWidth: '500px',
        },
        dialogContent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    }),
);

type RevisionPreviewDisplayFormProps = {
    submitText: string;
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
    handleDialogClose: (checkChanges: boolean) => void;
    url: string;
    revisionName: string;
};

const RevisionPreviewDisplayForm: FC<RevisionPreviewDisplayFormProps> = (
    props: RevisionPreviewDisplayFormProps,
) => {
    const classes = useStyles();

    const QRCodeSec = qrcode;

    return (
        <form className={classes.form} onSubmit={props.handleSubmit}>
            <DialogContent className={classes.dialogContent}>
                <DialogContentText id="alert-dialog-description">
                    {props.revisionName} Preview
                </DialogContentText>
                <QRCodeSec value={props.url} />
                <DialogContentText id="alert-dialog-description">
                    <Box fontSize={10} mt={1}>
                        Scan the code with your phone to preview
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActionsWithCancel
                handleDialogClose={props.handleDialogClose}
                confirmText={props.submitText}
            />
        </form>
    );
};

export default RevisionPreviewDisplayForm;
