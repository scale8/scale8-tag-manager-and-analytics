import { FC, FormEvent } from 'react';
import { Box, DialogContent, DialogContentText } from '@mui/material';
import qrcode from 'qrcode.react';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';

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
    const QRCodeSec = qrcode;

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '500px',
            }}
            onSubmit={props.handleSubmit}
        >
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
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
        </Box>
    );
};

export default RevisionPreviewDisplayForm;
