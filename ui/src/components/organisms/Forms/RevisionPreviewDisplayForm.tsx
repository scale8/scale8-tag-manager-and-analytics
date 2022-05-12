import { FC, FormEvent } from 'react';
import { Box, DialogContent, DialogContentText } from '@mui/material';
import qrcode from 'qrcode.react';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';

export type RevisionPreviewDisplayFormProps = {
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
                <Box mt={2} />
                <QRCodeSec
                    size={128}
                    renderAs="svg"
                    level="L"
                    value={props.url}
                    bgColor="transparent"
                    fgColor="black"
                    includeMargin={false}
                />
                <Box mt={1} />
                <DialogContentText id="alert-dialog-description">
                    <Box component="span" fontSize={10} mt={1}>
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
