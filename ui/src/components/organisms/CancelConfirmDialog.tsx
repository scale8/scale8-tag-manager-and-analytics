import { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { CancelConfirmDialogProps } from '../../types/props/CancelConfirmDialogProps';
import { DialogDangerConfirmButton } from '../atoms/DialogDangerConfirmButton';
import { DialogCancelButton } from '../atoms/DialogCancelButton';

const CancelConfirmDialog: FC<CancelConfirmDialogProps> = (props: CancelConfirmDialogProps) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                '& .MuiDialog-paper': {
                    padding: (theme) => theme.spacing(0, 2, 1, 2),
                },
            }}
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: 2,
                    justifyContent: 'center',
                }}
            >
                <DialogCancelButton onClick={props.handleCancel} autoFocus>
                    Cancel
                </DialogCancelButton>
                <DialogDangerConfirmButton onClick={props.handleConfirm}>
                    Confirm
                </DialogDangerConfirmButton>
            </DialogActions>
        </Dialog>
    );
};

export default CancelConfirmDialog;
